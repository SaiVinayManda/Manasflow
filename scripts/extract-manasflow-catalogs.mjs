import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const reference = "temp/linked-pages";
const sourceOrigin = process.env.MANASFLOW_SOURCE_ORIGIN;
if (!sourceOrigin) throw new Error("Set MANASFLOW_SOURCE_ORIGIN before extracting reference pages.");
const assetRequests = new Map();
const decode = (value = "") =>
  value
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
const rebrand = (value = "") =>
  value
    .replace(/\b[A-Z]{2}\s*Automate(?:\s*LLC)?/gi, "Manasflow")
    .replace(
      /(?:Boulanouar\s+Walid|Walid\s+Boulanouar|Adel\s+Dahani|David\s+Arnaux)/gi,
      "Manasflow Team",
    )
    .replace(/[\w.+-]+@[^\s]+/gi, "info@manasflow.com");
const text = (html = "") =>
  rebrand(
    decode(html.replace(/<[^>]*>/g, " "))
      .replace(/\s+/g, " ")
      .trim(),
  );
const attr = (html, name) =>
  decode(html.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "");
const imagePath = (source) => {
  if (!source) return "";
  const decoded = decode(source);
  const url = decoded.startsWith("/_next/image")
    ? new URL(decoded, sourceOrigin).searchParams.get("url")
    : decoded;
  if (
    !url ||
    /(?:team-walid|team-adel|walid|dahani|boulanouar|arnaux|headshot|portrait)/i.test(url)
  )
    return "";
  const absolute = new URL(url, sourceOrigin).href;
  const extension =
    path.extname(new URL(absolute).pathname).toLowerCase() || ".webp";
  const filename = `catalog-${createHash("sha256").update(absolute).digest("hex").slice(0, 14)}${extension}`;
  const local = `public/sites/manasflow/pages/${filename}`;
  assetRequests.set(absolute, { url: absolute, local });
  return local.replace(/^public/, "");
};

function blogCards(html) {
  const cards = [];
  const body = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || html;
  for (const match of body.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)) {
    const card = match[1];
    const href = attr(card.match(/<a\b[^>]*>/)?.[0] || "", "href");
    if (!href.startsWith("/blog/")) continue;
    const heading = card.match(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/)?.[1];
    const title = text(heading);
    const paragraphs = [...card.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(
      (m) => m[1],
    );
    const featured = paragraphs.some((p) => /^Featured\s*[·•]/i.test(text(p)));
    const description = text(paragraphs.at(-1));
    const metadata = [...card.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/g)].map(
      (m) => text(m[1]),
    );
    const date = featured
      ? text(paragraphs[0]).replace(/^Featured\s*[·•]\s*/i, "")
      : metadata.find((value) => /\w+ \d{1,2}, \d{4}/.test(value)) || "";
    const readingTime =
      metadata.find((value) => /\d+ min read/.test(value)) || "";
    const image = imagePath(attr(card.match(/<img\b[^>]*>/)?.[0] || "", "src"));
    cards.push({
      href,
      title,
      description,
      date,
      readingTime,
      image,
      featured,
    });
  }
  return cards;
}

const initialBlog = await fs.readFile(`${reference}/blog.html`, "utf8");
const initialCards = blogCards(initialBlog);
const featured = initialCards.filter((card) => card.featured);
const pages = { 1: initialCards.filter((card) => !card.featured) };
let files = [];
try {
  files = await fs.readdir(`${reference}/blog-pages`);
} catch {
  /* First extraction may precede archive download. */
}
for (const name of files
  .filter((name) => /^page-\d+\.html$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))) {
  const number = name.match(/\d+/)[0];
  const cards = blogCards(
    await fs.readFile(`${reference}/blog-pages/${name}`, "utf8"),
  );
  if (cards.some((card) => !card.featured))
    pages[number] = cards.filter((card) => !card.featured);
}
const totalPages = Number(
  text(initialBlog).match(/Page\s+1\s+of\s+(\d+)/)?.[1] || 52,
);

const playbookHtml = await fs.readFile(
  `${reference}/playbooks.main.html`,
  "utf8",
);
const playbooks = [];
for (const match of playbookHtml.matchAll(/<a\b([^>]+)>([\s\S]*?)<\/a>/g)) {
  const href = attr(match[1], "href");
  if (!href.startsWith("/playbooks/")) continue;
  const card = match[2];
  const title = text(card.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1]);
  if (!title) continue;
  const description = text(card.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1]);
  const category = text(
    card.match(/<span\b[^>]*bg-card\/80[^>]*>([\s\S]*?)<\/span>/)?.[1],
  );
  const difficulty = text(
    card.match(
      /<span\b[^>]*(?:bg-emerald|bg-amber|bg-rose)[^>]*>([\s\S]*?)<\/span>/,
    )?.[1],
  );
  playbooks.push({ href, title, description, category, difficulty });
}
const categories = [
  ...playbookHtml.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g),
]
  .map((m) => text(m[1]))
  .filter((value) => playbooks.some((card) => card.category === value));
let courses = [];
try {
  const courseData = JSON.parse(
    await fs.readFile(`${reference}/courses-api.json`, "utf8"),
  );
  const items = courseData.courses || courseData.data?.courses || [];
  courses = items.map((course) => ({
    href: `/courses/${course.slug}`,
    title: rebrand(course.title),
    description: rebrand(course.description || ""),
    image: imagePath(course.featuredImage),
    lessonCount: course.lessonCount || 0,
    duration: course.duration || "",
  }));
} catch {
  /* The observed public collection currently has no published courses. */
}

await fs.mkdir("src/data/manasflow", { recursive: true });
const data = {
  blog: { featured, pages, totalPages },
  playbooks: { categories, cards: playbooks },
  courses: { cards: courses },
};
await fs.writeFile(
  "src/data/manasflow/catalogs.json",
  JSON.stringify(data, null, 2) + "\n",
);
await fs.writeFile(
  "temp/catalog-asset-requests.json",
  JSON.stringify([...assetRequests.values()], null, 2) + "\n",
);
const deepPaths = [
  ...new Set(
    [...featured, ...Object.values(pages).flat(), ...playbooks, ...courses].map(
      (card) => card.href,
    ),
  ),
];
await fs.writeFile(
  "temp/catalog-deep-paths.json",
  JSON.stringify(deepPaths, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      featured: featured.length,
      blogPages: Object.keys(pages).length,
      blogPosts: Object.values(pages).flat().length,
      playbooks: playbooks.length,
      courses: courses.length,
      assets: assetRequests.size,
      deepPaths: deepPaths.length,
    },
    null,
    2,
  ),
);

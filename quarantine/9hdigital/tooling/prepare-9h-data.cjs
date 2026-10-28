/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const content = JSON.parse(
  fs.readFileSync("docs/research/9hdigital/content.json", "utf8"),
);
const local = (url) => "/sites/9hdigital/" + url.split("/").pop();
const data = {
  services: content.services.map((s) => ({ ...s, image: local(s.image) })),
  teams: content.teams.map((s, i) => ({
    ...s,
    image: local(s.image),
    label: ["Technology", "Product", "Marketing", "Operations", "Finance"][i],
  })),
  testimonials: content.testimonials.map((s) => ({
    ...s,
    image: local(s.image),
  })),
  posts: content.posts.map((s) => ({
    title: s.title,
    href: s.href,
    image: local(s.hover.match(/thumbnail = '([^']+)'/)[1]),
  })),
};
fs.writeFileSync(
  "src/components/sites/9hdigital/content.json",
  JSON.stringify(data, null, 2),
);
const html = fs.readFileSync("docs/research/9hdigital/source.html", "utf8");
for (const [label, name] of [
  ["Facebook", "facebook"],
  ["Instagram", "instagram"],
  ["Linkedin", "linkedin"],
]) {
  const anchor = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].find((m) =>
    m[0].includes(`aria-label="${label}"`),
  )?.[0];
  const svg = anchor.match(/<svg[\s\S]*?<\/svg>/)[0];
  fs.writeFileSync(`public/sites/9hdigital/${name}.svg`, svg);
}
const sections = JSON.parse(
  fs.readFileSync("docs/research/9hdigital/desktop-inspection.json"),
).sections;
fs.writeFileSync(
  "public/sites/9hdigital/quote.svg",
  sections[7].html.match(/<svg[\s\S]*?<\/svg>/)[0],
);
fs.writeFileSync(
  "public/sites/9hdigital/play.svg",
  sections[8].html.match(/<svg[\s\S]*?<\/svg>/)[0],
);
console.log("Prepared editable content and original inline SVG assets.");

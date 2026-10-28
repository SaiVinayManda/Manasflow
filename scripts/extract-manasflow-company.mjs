import fs from "node:fs/promises";
import { createRequire } from "node:module";

// Extract public content data only. Source application code is never executed.
const require = createRequire(import.meta.url);
const { parse } = require("acorn");
const directory = "temp/linked-pages";
const rebrand = value => typeof value === "string" ? value.replace(/\b[A-Z]{2}\s*Automate\b/gi, "Manasflow").replace(/\b[a-z]{2}automate\.com\b/gi, "manasflow.com") : value;
function literal(node) {
  if (node.type === "Literal") return rebrand(node.value);
  if (node.type === "ArrayExpression") return node.elements.map(literal);
  if (node.type === "ObjectExpression") return Object.fromEntries(node.properties.filter(property => property.type === "Property" && property.key.name !== "icon").map(property => [property.key.name || property.key.value, literal(property.value)]));
  return null;
}
function arrays(source) {
  const found = [];
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "ArrayExpression") {
      try { found.push(literal(node)); } catch { /* Ignore executable expressions. */ }
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === "start" || key === "end") continue;
      if (Array.isArray(value)) value.forEach(walk); else if (typeof value === "object") walk(value);
    }
  }
  walk(parse(source, { ecmaVersion: "latest" }));
  return found;
}
const faqHtml = await fs.readFile(`${directory}/faq.main.html`, "utf8");
const faqInfo = JSON.parse(await fs.readFile(`${directory}/faq.json`, "utf8"));
const schema = [...faqHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(value => value["@type"] === "FAQPage");
const answers = new Map(schema.mainEntity.map(question => [question.name, question.acceptedAnswer.text]));
const faqGroups = [];
for (const heading of faqInfo.headings) {
  if (heading.tag === "H2" && heading.text !== "Still have questions?") faqGroups.push({ title: rebrand(heading.text), items: [] });
  if (heading.tag === "H3") faqGroups.at(-1).items.push({ question: rebrand(heading.text), answer: rebrand(answers.get(heading.text)) });
}
const serviceArrays = arrays(await fs.readFile(`${directory}/chunks/page-d0eb8436df06178d.js`, "utf8"));
const services = serviceArrays.find(value => value.length === 10 && value[0]?.imageSrc);
const sectors = serviceArrays.find(value => value.length === 3 && value[0]?.title && value[0]?.description && !value[0]?.features);
const comparison = serviceArrays.find(value => value[0]?.metric && value[0]?.manual);
const governance = serviceArrays.find(value => value[0]?.title === "Data Privacy & GDPR");
const agencies = serviceArrays.find(value => value[0]?.href && value[0]?.desc);
const serviceFaqs = serviceArrays.find(value => value.length === 4 && value[0]?.question);
const careerArrays = arrays(await fs.readFile(`${directory}/chunks/page-5842fa836eebb450.js`, "utf8"));
const skills = careerArrays.find(value => value[0] === "AI Agents");
const careerValues = careerArrays.find(value => value[0]?.title === "Real production");
const careerStats = careerArrays.find(value => value[0]?.label === "Clients shipping in production");
const careerFit = careerArrays.find(value => typeof value[0] === "string" && value[0].startsWith("You shipped at least"));
const contactHtml = await fs.readFile(`${directory}/contact.main.html`, "utf8");
const contactSchema = [...contactHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(value => value["@type"] === "FAQPage");
const contactFaqs = contactSchema.mainEntity.map(question => ({ question: rebrand(question.name), answer: rebrand(question.acceptedAnswer.text) }));
contactFaqs[0].answer = "Send your enquiry to info@manasflow.com and we’ll reply to arrange the next step. If you prefer a call, use the strategy-call request above and include your availability.";
contactFaqs[1].answer = "The forms on this website prepare an email draft in your email app. You choose whether to send it to Manasflow. We never sell or spam the contact details you share. See our privacy notice for more information.";
const data = { faqGroups, services, sectors, comparison, governance, agencies, serviceFaqs, skills, careerValues, careerStats, careerFit, contactFaqs };
await fs.mkdir("src/data/manasflow", { recursive: true });
await fs.writeFile("src/data/manasflow/company-pages.json", `${JSON.stringify(data, null, 2)}\n`);
console.log(Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value?.length])));

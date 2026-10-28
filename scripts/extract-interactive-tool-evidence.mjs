import fs from "node:fs/promises";
import ts from "typescript";

const input = JSON.parse(await fs.readFile("src/data/manasflow/tools.json", "utf8"));
const clean = value => value.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(property => [property.name.text, literal(property.initializer)]).filter(([, value]) => value !== undefined));
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}
const evidence = {};
for (const tool of input.tools) {
  const html = await fs.readFile(`temp/linked-pages/details/${encodeURIComponent(`/tools/${tool.slug}`)}.html`, "utf8");
  const chunk = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match => match[1]).find(url => url.includes("/app/tools/"))?.split("/").at(-1).split("?")[0];
  const arrays = [];
  if (chunk) {
    const source = ts.createSourceFile(chunk, await fs.readFile(`temp/linked-pages/chunks/${chunk}`, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = node => {
      if (ts.isVariableDeclaration(node) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
        const value = literal(node.initializer);
        if (value?.length && value.some(item => item && typeof item === "object" && !Array.isArray(item))) arrays.push(value);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  let questions = arrays.find(array => array.some(item => item?.question || item?.text || item?.questions || (item?.title && item?.options))) || [];
  if (tool.slug === "digital-transformation-scorecard") questions = questions.flatMap(pillar => pillar.questions.map(question => ({ ...question, pillar: pillar.name })));
  const normalized = questions.map(question => ({
    id: question.id,
    pillar: question.pillar || question.dimension || question.id,
    text: question.text || question.question || question.title,
    subtitle: question.subtitle || "",
    multiple: question.type === "multi",
    options: (question.options || question.answers || []).map((option, index, options) => typeof option === "string" ? { label: option, value: String(index), points: Math.round(index / (options.length - 1) * 100) } : { label: option.label, description: option.description || "", value: option.value || String(index), points: option.points === undefined ? Math.round(index / (options.length - 1) * 100) : question.pillar && tool.slug === "ai-readiness-assessment" ? option.points * 5 : tool.slug === "ai-governance-maturity-assessment" ? option.points * 25 : option.points }),
  }));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => { try { const value = JSON.parse(match[1]); return Array.isArray(value) ? value : [value]; } catch { return []; } });
  const faq = schemas.find(schema => schema["@type"] === "FAQPage");
  evidence[tool.slug] = { questions: normalized, faqs: faq?.mainEntity?.map(item => ({ question: clean(item.name), answer: clean(item.acceptedAnswer.text) })) || [] };
}
const sanitized = JSON.stringify(evidence, null, 2).replace(/AY\s*Automate|AyAutomate/gi, "ManasFlow").replace(/ayautomate\.com/gi, "manasflow.com");
await fs.writeFile("src/data/manasflow/tool-source-evidence.json", `${sanitized}\n`);
console.log(Object.entries(evidence).map(([slug, value]) => `${slug}: ${value.questions.length} questions, ${value.faqs.length} FAQs`).join("\n"));

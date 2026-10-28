import fs from "node:fs/promises";
import ts from "typescript";

const base = "temp/linked-pages";
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isPrefixUnaryExpression(node)) {
    const value = literal(node.operand);
    if (node.operator === ts.SyntaxKind.ExclamationToken) return !value;
    if (node.operator === ts.SyntaxKind.MinusToken) return -value;
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.flatMap((p) => {
    if (!ts.isPropertyAssignment(p)) return [];
    const value = literal(p.initializer);
    return value === undefined ? [] : [[p.name.getText().replace(/^['"]|['"]$/g, ""), value]];
  }));
  return undefined;
}
async function arrays(file) {
  const text = await fs.readFile(file, "utf8");
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const result = [];
  function walk(node) {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) result.push(literal(node.initializer));
    ts.forEachChild(node, walk);
  }
  walk(ast);
  return result;
}
async function flight(name) {
  const html = await fs.readFile(`${base}/${name}.html`, "utf8");
  const chunks = [];
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    const ast = ts.createSourceFile("flight.js", match[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    function walk(node) {
      if (ts.isCallExpression(node) && node.expression.getText(ast) === "self.__next_f.push") {
        const arg = node.arguments[0];
        if (arg && ts.isArrayLiteralExpression(arg) && arg.elements[1] && ts.isStringLiteral(arg.elements[1])) chunks.push(arg.elements[1].text);
      }
      ts.forEachChild(node, walk);
    }
    walk(ast);
  }
  return chunks.join("");
}
function jsonArrayAfter(text, marker) {
  const start = text.indexOf(marker) + marker.length;
  if (start < marker.length || text[start] !== "[") throw new Error(`Missing ${marker}`);
  let depth = 0, quote = false, escape = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (quote) { if (escape) escape = false; else if (char === "\\") escape = true; else if (char === '"') quote = false; }
    else if (char === '"') quote = true;
    else if (char === "[") depth++;
    else if (char === "]" && --depth === 0) return JSON.parse(text.slice(start, i + 1));
  }
  throw new Error("Incomplete Flight JSON array");
}
function resolveFlightText(text, object) {
  const strings = new Map();
  const bytes = Buffer.from(text, "utf8");
  const ascii = bytes.toString("latin1");
  for (const match of ascii.matchAll(/(?:^|\n)([a-f0-9]+):T([a-f0-9]+),/g)) {
    const start = match.index + match[0].length;
    strings.set(match[1], bytes.subarray(start, start + parseInt(match[2], 16)).toString("utf8"));
  }
  function resolve(value) {
    if (typeof value === "string") {
      const reference = value.match(/^\$([a-f0-9]+)$/);
      return reference && strings.has(reference[1]) ? strings.get(reference[1]) : value;
    }
    if (Array.isArray(value)) return value.map(resolve);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item)]));
    return value;
  }
  return resolve(object);
}
function sanitize(value) {
  if (typeof value === "string") return value.replace(/\b[A-Z]{2}\s*Automate\b/gi,"Manasflow").replace(/https?:\/\/(?:www\.)?[^/\s]+/gi, "").replace(/[\w.+-]+@[^\s]+/gi,"info@manasflow.com");
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,sanitize(v)]));
  return value;
}
const modelArrays = await arrays(`${base}/chunks/1985-9094c4da3d271f67.js`);
const models = modelArrays.find((array) => array.length === 41 && array[0]?.inputPricePerMTok !== undefined);
const freeFlight = await flight("free-models");
const freeModels = resolveFlightText(freeFlight, jsonArrayAfter(freeFlight, '"models":'));
const leaderArrays = await arrays(`${base}/chunks/page-267f74e799cdfdca.js`);
const glossary = leaderArrays.find((array) => array[0]?.term && array[0]?.def) || [];
const pricingArrays = await arrays(`${base}/chunks/page-6c5496ede11aa11a.js`);
const usagePresets = pricingArrays.find((array) => array[0]?.inputM) || [];
const faqs = {};
for (const name of ["models", "free-models", "models--pricing"]) {
  const html = await fs.readFile(`${base}/${name}.html`, "utf8");
  for (const script of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { const json = JSON.parse(script[1]); if (json["@type"] === "FAQPage") faqs[name] = json.mainEntity.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text })); } catch { /* Non-JSON reference blocks are ignored. */ }
  }
}
const routes = [...models.map((m) => `/models/${m.slug}`),...freeModels.map((m) => `/free-models/${m.slug}`)];
await fs.mkdir("src/data/manasflow", { recursive: true });
await fs.writeFile("src/data/manasflow/models.json", JSON.stringify(sanitize({ models, freeModels, glossary, usagePresets, faqs }), null, 2));
await fs.writeFile(`${base}/model-deep-routes.json`, JSON.stringify(routes, null, 2));
console.log(JSON.stringify({ models: models.length, freeModels: freeModels.length, pricing: models.filter((m) => m.inputPricePerMTok !== null && m.outputPricePerMTok !== null).length, glossary: glossary.length, faqCounts: Object.fromEntries(Object.entries(faqs).map(([key,value])=>[key,value.length])), first:models[0], freeFirst:freeModels[0] }, null, 2));

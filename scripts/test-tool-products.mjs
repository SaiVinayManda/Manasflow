import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { loadTypescript } from "./lib/load-typescript.mjs";

const { TOOL_PRODUCTS, toolCardUrl } = loadTypescript("src/lib/tool-products.ts");
const { pageGraph } = loadTypescript("src/lib/seo.ts");
const { pageMetadata } = loadTypescript("src/lib/metadata.ts");
const { getInteractiveTool, INTERACTIVE_TOOL_SLUGS, interactiveToolMetadata } = loadTypescript("src/lib/interactive-tool-data.ts");
const { readToolParam, restoreNumbers, restoreIndices, restoreProfile } = loadTypescript("src/lib/tool-url-state.ts");
const { CALCULATOR_CONFIG } = loadTypescript("src/lib/calculator-config.ts");
const { CAL_BOOKING_URL } = loadTypescript("src/lib/booking.ts");

for (const tool of TOOL_PRODUCTS) {
  const route = `/${tool.slug}`;
  const apps = pageGraph(route)["@graph"].filter(node => node["@type"] === "SoftwareApplication");
  assert.equal(apps.length, 1, `${route}: one software application`);
  assert.equal(apps[0].offers.price, "0");
  assert.equal(apps[0].provider["@id"], "https://manasflow.com/#organization");
  const metadata = getInteractiveTool(tool.slug) ? interactiveToolMetadata(tool.slug) : pageMetadata(tool.title, tool.subtitle, route);
  assert.equal(metadata.openGraph.images[0].url, toolCardUrl(tool.slug));
  assert.equal(metadata.twitter.images[0], toolCardUrl(tool.slug));
}
for (const route of ["/directory?page=2", "/ai-model-comparison?page=2", "/ai-model-pricing-index?page=2"]) {
  assert.ok(pageGraph(route)["@graph"].some(node => node["@type"] === "SoftwareApplication"));
  assert.equal(pageMetadata("Models", "Models", route).openGraph.images[0].url, toolCardUrl(route.slice(1).split("?")[0]));
}
assert.deepEqual(readToolParam("?inputs=%7Bbroken", "inputs", { hours: 10 }), { hours: 10 });
assert.deepEqual(readToolParam(`?inputs=${encodeURIComponent('{"hours":"wrong","extra":1}')}`, "inputs", { hours: 10 }), { hours: 10 });
assert.deepEqual(restoreNumbers({ hours: 1e300, rate: -5, coverage: 120 }, { hours: 10, rate: 40, coverage: 70 }, { hours: { max: 168 }, coverage: { max: 100 } }), { hours: 168, rate: 0, coverage: 100 });
assert.deepEqual(restoreIndices([0, 0, 1, -1, 100, "2", 1.5], 5), [0, 1]);
assert.deepEqual(restoreProfile({ department: "__proto__", hours: -1 }, { department: "Operations", hours: 10 }, { department: ["Operations", "Sales"] }), { department: "Operations", hours: 0 });

// Exercise the actual client components and URL hook with an in-memory browser
// boundary. Formula tests live in test-tool-calculations.mjs; this checks that
// results, sharing controls, resets, and booking affordances survive URL restore.
let currentUrl = new URL("https://manasflow.com/");
let clipboard = "";
const events = new EventTarget();
const browser = {
  get location() { return currentUrl; },
  addEventListener: (...args) => events.addEventListener(...args),
  removeEventListener: (...args) => events.removeEventListener(...args),
  dispatchEvent: event => events.dispatchEvent(event),
  history: { state: { nextRouter: true }, replaceState(state, _title, url) { assert.deepEqual(state, this.state); currentUrl = new URL(url, currentUrl); } },
};
const jsx = (type, props) => ({ type, props: props || {} });
const react = {
  useState: initial => [typeof initial === "function" ? initial() : initial, () => {}],
  useSyncExternalStore: (_subscribe, snapshot) => snapshot(),
  useMemo: compute => compute(), useId: () => "test-field", Fragment: "fragment",
};
const cache = new Map();
function loadUi(filename) {
  filename = path.resolve(filename);
  if (!path.extname(filename)) filename += fs.existsSync(`${filename}.tsx`) ? ".tsx" : ".ts";
  if (cache.has(filename)) return cache.get(filename).exports;
  const loadedModule = { exports: {} };
  cache.set(filename, loadedModule);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const require = specifier => {
    if (specifier.endsWith(".css")) return {};
    if (specifier === "react") return react;
    if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
    if (specifier === "lucide-react") return new Proxy({}, { get: () => () => null });
    if (specifier === "next/link") return "a";
    if (specifier === "./booking-link") return { ActionLink: "a", BookingLink: props => jsx("a", { ...props, href: CAL_BOOKING_URL }) };
    if (specifier === "./shared") return { Reveal: props => props.children, Badge: props => props.children };
    if (specifier === "./subpage-shared") return { SubpageHero: props => jsx("header", { children: [props.title, props.children] }) };
    if (specifier.startsWith("@/lib/") || specifier.startsWith("@/data/")) return loadTypescript(path.join("src", specifier.slice(2)));
    if (specifier.startsWith("@/")) return loadUi(path.join("src", specifier.slice(2)));
    if (specifier.startsWith(".")) return loadUi(path.resolve(path.dirname(filename), specifier));
    throw new Error(`Unexpected import: ${specifier}`);
  };
  new Function("require", "module", "exports", "window", "navigator", "Event", source)(require, loadedModule, loadedModule.exports, browser, { clipboard: { async writeText(value) { clipboard = value; } } }, Event);
  return loadedModule.exports;
}
function expand(node) {
  if (Array.isArray(node)) return node.flatMap(expand);
  if (node == null || node === false) return [];
  if (typeof node !== "object") return [String(node)];
  if (typeof node.type === "function") return expand(node.type(node.props));
  return [{ ...node, children: expand(node.props.children) }];
}
const descendants = nodes => nodes.flatMap(node => typeof node === "string" ? [] : [node, ...descendants(node.children)]);
const content = nodes => nodes.map(node => typeof node === "string" ? node : content(node.children)).join(" ");
function open(slug, state) {
  currentUrl = new URL(`https://manasflow.com/${slug}`);
  for (const [key, value] of Object.entries(state)) currentUrl.searchParams.set(key, JSON.stringify(value));
}
async function checkOutput(nodes, label) {
  const text = content(nodes);
  assert.ok(text.includes("Copy Share Link"), `${label}: share action`);
  const all = descendants(nodes);
  const cta = all.find(node => node.type === "a" && content(node.children).includes("Book a Discovery Call"));
  assert.equal(cta?.props.href, CAL_BOOKING_URL, `${label}: existing Cal.com flow`);
  const share = all.find(node => node.type === "button" && content(node.children).includes("Copy Share Link"));
  await share.props.onClick();
  assert.equal(clipboard, currentUrl.href, `${label}: copied URL contains restored state`);
}
const { InteractiveTool } = loadUi("src/components/sites/manasflow/interactive-tools.tsx");
for (const slug of INTERACTIVE_TOOL_SLUGS) {
  const tool = getInteractiveTool(slug);
  const state = tool.questions.length ? { stage: "result", answers: Object.fromEntries(tool.questions.map(question => [question.id, [question.options.length - 1]])) }
    : slug === "workflow-audit" ? { report: true, workflows: [{ id: 1, name: "Invoice processing", department: "Finance", hours: 12, people: 3, rate: 50, coverage: 70, tools: "Email", pain: "" }] }
    : slug === "ai-job-description-generator" ? { text: "A shared and edited job description" }
    : slug === "fde-salary-explorer" ? { region: "United States", experience: "5–10 years" }
    : { result: true, name: "Shared planning scenario" };
  if (CALCULATOR_CONFIG[slug]) {
    state.inputs = Object.fromEntries(CALCULATOR_CONFIG[slug].fields.map(field => [field.id, field.value]));
    state.calculation = state.inputs;
  }
  if (slug === "ai-budget-planner") state.calculation = { type: "AI chatbot / agent", scope: "Pilot / proof of concept", urgency: "Standard", data: "Needs cleanup", team: "Some internal capacity", complexity: "Medium", months: 6, contingency: 20 };
  open(slug, state);
  const nodes = expand(jsx(InteractiveTool, { slug }));
  await checkOutput(nodes, slug);
  if (tool.questions.length && slug !== "ai-tool-selector") assert.ok(content(nodes).includes("100"), `${slug}: restored high score`);
}
open("ai-readiness-assessment", { stage: "result", answers: { unknown: [100] }, step: 1e30 });
assert.ok(!content(expand(jsx(InteractiveTool, { slug: "ai-readiness-assessment" }))).includes("Retake assessment"), "Incomplete assessment must not show a finished result");
open("ai-use-case-generator", { result: true, profile: { department: "__proto__" } });
assert.ok(content(expand(jsx(InteractiveTool, { slug: "ai-use-case-generator" }))).includes("Operations opportunities"));

open("automation-payback-calculator", { inputs: { tasks: 1000 } });
let calculatorNodes = expand(jsx(InteractiveTool, { slug: "automation-payback-calculator" }));
descendants(calculatorNodes).find(node => node.type === "form").props.onSubmit({ preventDefault() {} });
calculatorNodes = expand(jsx(InteractiveTool, { slug: "automation-payback-calculator" }));
const submittedCalculation = currentUrl.searchParams.get("calculation");
descendants(calculatorNodes).find(node => node.props.id === "it-tasks").props.onChange({ target: { value: "2000" } });
assert.equal(currentUrl.searchParams.get("calculation"), submittedCalculation, "Editing assumptions preserves the last submitted result until recalculated");
assert.ok(currentUrl.searchParams.get("inputs").includes("2000"));

const { ProductLandingPage } = loadUi("src/components/sites/manasflow/product-landing.tsx");
for (const slug of ["manasrank", "manasdesign", "manasn8n", "manasclaude", "manas-skills", "manas-framework"]) {
  open(slug, { checks: [0, 2, 4], company: "Example", tone: "Teal", stage: 2 });
  const nodes = expand(jsx(ProductLandingPage, { slug }));
  await checkOutput(nodes, slug);
  if (slug === "manasrank") assert.ok(content(nodes).includes("60"));
}
const { ModelDirectory } = loadUi("src/components/sites/manasflow/model-directory.tsx");
const modelData = JSON.parse(fs.readFileSync("src/data/manasflow/models.json", "utf8"));
open("ai-model-pricing-index", { inputM: 25, outputM: 5, compare: modelData.models.slice(0, 2).map(model => model.slug), provider: "All providers" });
const modelNodes = expand(jsx(ModelDirectory, { pricing: true }));
await checkOutput(modelNodes, "Model pricing");
assert.ok(content(modelNodes).includes("2 /3 selected") || content(modelNodes).includes("2 /3"));
const inputs = descendants(modelNodes).filter(node => node.type === "input" && node.props.type === "number");
assert.deepEqual(inputs.map(node => node.props.value), [25, 5]);
const next = descendants(modelNodes).find(node => node.type === "a" && content(node.children).includes("Next"));
assert.ok(next?.props.href.includes("compare="), "Pagination preserves the shared shortlist");

// Functional updates compose against the latest URL, preserve unrelated query
// parameters and hash, and remove only the reset state key.
const { useToolState: readState } = loadUi("src/hooks/use-tool-state.ts");
currentUrl = new URL("https://manasflow.com/manasrank?utm_source=qa#product-workspace");
let [, setCompany] = readState("company", "");
setCompany("Acme & Sons");
setCompany(previous => `${previous} Europe`);
assert.equal(readState("company", "")[0], "Acme & Sons Europe");
assert.equal(currentUrl.searchParams.get("utm_source"), "qa");
assert.equal(currentUrl.hash, "#product-workspace");
setCompany("");
assert.ok(!currentUrl.searchParams.has("company"));

if (process.env.TOOL_BASE_URL) {
  const base = process.env.TOOL_BASE_URL;
  for (const tool of TOOL_PRODUCTS) {
    const response = await fetch(`${base}/${tool.slug}`);
    assert.equal(response.status, 200, tool.slug);
    const html = await response.text();
    assert.ok(html.includes(`https://manasflow.com${toolCardUrl(tool.slug)}`), `${tool.slug}: rendered card URL`);
    const schema = JSON.parse(html.match(/<script id="manasflow-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || "null");
    assert.ok(schema?.["@graph"].some(node => node["@type"] === "SoftwareApplication" && node.offers.price === "0" && node.provider["@id"] === "https://manasflow.com/#organization"));
    const imageResponse = await fetch(`${base}${toolCardUrl(tool.slug)}`);
    assert.equal(imageResponse.status, 200, `${tool.slug}: image status`);
    assert.equal(imageResponse.headers.get("content-type"), "image/png");
    const png = Buffer.from(await imageResponse.arrayBuffer());
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
  console.log(`Rendered checks passed: ${TOOL_PRODUCTS.length} routes, software schemas, and 1200×630 PNG cards.`);
}
console.log(`Tool product checks passed: ${TOOL_PRODUCTS.length} metadata/schema records, ${INTERACTIVE_TOOL_SLUGS.length} restored tools, six platform workspaces, model shortlist/usage/pagination, URL validation, sharing, and resets.`);

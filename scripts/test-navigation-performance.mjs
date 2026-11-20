import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";
import { loadTypescript } from "./lib/load-typescript.mjs";

const base = "src/components/sites/manasflow/";
for (const file of ["chrome", "home", "capabilities", "lower-sections", "shared"]) {
  const source = fs.readFileSync(`${base}${file}.tsx`, "utf8");
  assert.ok(!/^\s*["']use client["']/.test(source), `${file}: static content stays on the server`);
}
const cal = ts.createSourceFile("cal-provider.tsx", fs.readFileSync(`${base}cal-provider.tsx`, "utf8"), ts.ScriptTarget.Latest, true);
for (const declaration of cal.statements.filter(ts.isImportDeclaration)) if (declaration.moduleSpecifier.text === "@calcom/embed-react") assert.ok(declaration.importClause.isTypeOnly, "The Cal SDK must not be a synchronous import");
const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
assert.ok(!layout.includes("CalProvider") && !layout.includes('href="https://cal.com"'), "Layout must not initialize or preconnect Cal");
const css = fs.readFileSync(`${base}chrome.css`, "utf8");
assert.ok(!css.match(/\.mf-nav-bar\s*\{[^}]*backdrop-filter/), "Header must not paint a backdrop blur");
assert.ok(!fs.readFileSync(`${base}header-navigation.tsx`, "utf8").includes("setTimeout"), "Menus must not wait on a delay timer");
assert.ok(!fs.readFileSync(`${base}header-navigation.tsx`, "utf8").includes("useState"), "Neither mobile nor desktop menu state depends on React hydration");

const effects = [];
const listeners = new Map();
let stateUpdates = 0;
let lastObserverCallback;
const browserDocument = {
  visibilityState: "visible",
  addEventListener(name, callback) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback); },
  removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
};
const jsx = (type, props) => ({ type, props: props || {} });
const react = {
  useRef: value => ({ current: value }),
  useState: initial => [initial, () => { stateUpdates++; }],
  useEffect: effect => { effects.push(effect); },
};
const cache = new Map();
function loadUi(filename) {
  filename = path.resolve(filename);
  if (!path.extname(filename)) filename += ".tsx";
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = { exports: {} };
  cache.set(filename, loaded);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
  const require = specifier => {
    if (specifier.endsWith(".css")) return {};
    if (specifier === "react") return react;
    if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
    if (specifier === "next/link") return { default: "link" };
    if (specifier === "lucide-react") return new Proxy({}, { get: () => () => jsx("svg", {}) });
    if (specifier === "./booking-link") return { ActionLink: props => jsx("link", props) };
    if (specifier === "./newsletter") return { Newsletter: () => null };
    if (specifier === "./shared") return { Badge: props => props.children, Reveal: props => props.children, SiteImage: props => jsx("img", props) };
    if (specifier.startsWith("@/lib/") || specifier.startsWith("@/data/")) return loadTypescript(path.join("src", specifier.slice(2)));
    if (specifier.startsWith(".")) return loadUi(path.resolve(path.dirname(filename), specifier));
    throw new Error(`Unexpected import: ${specifier}`);
  };
  class Observer {
    constructor(callback) { lastObserverCallback = callback; }
    observe() {}
    disconnect() {}
  }
  new Function("require", "module", "exports", "document", "window", "IntersectionObserver", source)(require, loaded, loaded.exports, browserDocument, { matchMedia: () => ({ matches: false }) }, Observer);
  return loaded.exports;
}
function expand(node) {
  if (Array.isArray(node)) return node.flatMap(expand);
  if (node == null || typeof node !== "object") return [];
  if (typeof node.type === "function") return expand(node.type(node.props));
  return [node, ...expand(node.props.children)];
}

const { Header, Footer } = loadUi(`${base}chrome.tsx`);
const header = expand(Header());
const headerLinks = header.filter(node => node.type === "link");
assert.equal(headerLinks.filter(node => node.props.prefetch !== false).length, 5, "Only the five primary hub links may prefetch");
assert.deepEqual(headerLinks.filter(node => node.props.prefetch !== false).map(node => node.props.href), ["/services", "/platform", "/tools", "/ai-tools", "/blog"]);
assert.ok(headerLinks.filter(node => !node.props.className?.includes("mf-hub-link")).every(node => node.props.prefetch === false));
assert.equal(header.filter(node => node.props.className === "mf-mega-menu").length, 2, "Desktop/mobile share each menu once");
assert.equal(header.filter(node => node.type === "details" && node.props.className === "mf-mobile-disclosure").length, 1, "Mobile toggle is a native disclosure");
assert.ok(expand(Footer({})).filter(node => node.type === "link").every(node => node.props.prefetch === false), "Footer links cannot prefetch routes");

const dropdown = header.find(node => node.type === "details" && node.props.className === "mf-header-dropdown");
const summary = { focus() { focused = "summary"; } };
const firstLink = { focus() { focused = "link"; } };
let focused = "";
const detailsElement = { open: false, contains: () => false, querySelector: selector => selector === "summary" ? summary : firstLink };
dropdown.props.ref.current = detailsElement;
const updatesBefore = stateUpdates;
dropdown.props.onKeyDown({ key: "ArrowDown", target: summary, currentTarget: detailsElement, preventDefault() {} });
assert.equal(detailsElement.open, true);
assert.equal(focused, "link");
dropdown.props.onKeyDown({ key: "Escape", currentTarget: detailsElement, stopPropagation() {} });
assert.equal(detailsElement.open, false);
assert.equal(focused, "summary");
assert.equal(stateUpdates, updatesBefore, "Opening/closing a desktop dropdown never schedules React state updates");
detailsElement.open = true;
dropdown.props.onClickCapture({ currentTarget: detailsElement, target: { closest: () => firstLink } });
assert.equal(detailsElement.open, false, "Selecting a menu destination closes its disclosure");
for (const effect of effects.splice(0)) effect();
detailsElement.open = true;
for (const callback of listeners.get("pointerdown")) callback({ target: {} });
assert.equal(detailsElement.open, false, "Outside click closes the native disclosure");

const { ViewportVideo } = loadUi(`${base}viewport-video.tsx`);
const videoNode = ViewportVideo({ src: "/demo.webm", label: "Demo" });
assert.equal(videoNode.props.src, undefined, "SSR video cannot request the media file");
assert.equal(videoNode.props.autoPlay, undefined);
assert.equal(videoNode.props.preload, "none");
let source = "";
let plays = 0;
let pauses = 0;
const video = { get src() { return source; }, set src(value) { source = value; }, getAttribute: () => source, pause() { pauses++; }, async play() { plays++; } };
videoNode.props.ref.current = video;
const cleanup = effects.pop()();
assert.equal(source, "", "Mounting a below-fold video must not load it");
lastObserverCallback([{ isIntersecting: true }]);
assert.equal(source, "/demo.webm");
assert.equal(plays, 1);
browserDocument.visibilityState = "hidden";
for (const callback of listeners.get("visibilitychange")) callback();
assert.equal(pauses, 1);
cleanup();
assert.equal(listeners.get("visibilitychange").size, 0);

if (process.env.PERF_BASE_URL) {
  const response = await fetch(process.env.PERF_BASE_URL);
  assert.equal(response.status, 200);
  const html = await response.text();
  const headerMarkup = html.match(/<header class="mf-header"[\s\S]*?<\/header>/)[0];
  assert.equal((headerMarkup.match(/class="mf-header-dropdown"/g) || []).length, 2);
  assert.equal((headerMarkup.match(/class="mf-mega-menu"/g) || []).length, 2);
  for (const match of html.matchAll(/<video\b[^>]*>/g)) {
    assert.ok(match[0].includes("data-video-src="));
    assert.ok(!/\ssrc=|\sautoPlay(?:=|\s|>)/i.test(match[0]));
  }
  assert.ok(!/<link\b[^>]*(?:preconnect|dns-prefetch)[^>]*cal\.com/.test(html));
  console.log("Rendered performance checks passed: native server-rendered menus, two menu trees, dormant videos, and no scheduling preconnect hints.");
}
console.log("Navigation performance checks passed: five prefetchable hubs, no secondary/footer prefetch, native dropdown keyboard/outside/click behavior, zero dropdown React updates, and viewport-only video loading.");

import fs from "node:fs/promises";
import assert from "node:assert/strict";
import vm from "node:vm";
import ts from "typescript";

const settle = async () => { for (let index = 0; index < 8; index++) await Promise.resolve(); };
const clickEvent = (overrides = {}) => ({ button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false, propagationStopped: false, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.propagationStopped = true; }, ...overrides });

async function harness({ deferred = false, rejected = false } = {}) {
  const sdkCalls = [];
  const listeners = new Set();
  const keyListeners = new Set();
  const timers = new Map();
  const navigations = [];
  let clock = 0;
  let nextTimer = 0;
  let getApiCalls = 0;
  let resolveApi;
  const pendingApi = new Promise(resolve => { resolveApi = resolve; });
  const fakeApi = (...args) => {
    sdkCalls.push(args);
    const [instruction, options] = args;
    if (instruction === "on") listeners.add(options.callback);
    if (instruction === "off") listeners.delete(options.callback);
  };
  const browserWindow = {
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, at: clock + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener(name, callback) { assert.equal(name, "keydown"); keyListeners.add(callback); },
    removeEventListener(name, callback) { assert.equal(name, "keydown"); keyListeners.delete(callback); },
    location: { assign: url => navigations.push(url) },
  };
  const jsx = (type, props) => ({ type, props });
  const icon = () => null;
  const mocks = {
    react: { useEffect: effect => effect(), isValidElement: value => Boolean(value && typeof value === "object" && "props" in value) },
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/link": { default: "next-link" },
    "lucide-react": { ArrowRight: icon, Calendar: icon, Clock: icon, Workflow: icon },
    "@calcom/embed-react": { getCalApi: options => {
      getApiCalls++;
      assert.equal(options.namespace, "30min");
      assert.equal(options.embedJsUrl, "https://cal.com/embed/embed.js");
      if (rejected) return Promise.reject(new Error("SDK unavailable"));
      return deferred ? pendingApi : Promise.resolve(fakeApi);
    } },
  };
  async function load(filename) {
    const source = await fs.readFile(filename, "utf8");
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
    const compiledModule = { exports: {} };
    vm.runInNewContext(compiled, { module: compiledModule, exports: compiledModule.exports, require: name => { if (!(name in mocks)) throw new Error(`Unexpected import ${name}`); return mocks[name]; }, window: browserWindow }, { filename });
    return compiledModule.exports;
  }
  const booking = await load("src/lib/booking.ts");
  mocks["@/lib/booking"] = booking;
  const provider = await load("src/components/sites/manasflow/cal-provider.tsx");
  mocks["./cal-provider"] = provider;
  mocks["@/lib/contact"] = await load("src/lib/contact.ts");
  mocks["./whatsapp-contact"] = await load("src/components/sites/manasflow/whatsapp-contact.tsx");
  const links = await load("src/components/sites/manasflow/booking-link.tsx");
  return {
    booking, provider, links, sdkCalls, timers, navigations,
    getApiCalls: () => getApiCalls,
    modalCount: () => sdkCalls.filter(([instruction]) => instruction === "modal").length,
    resolveApi: () => resolveApi(fakeApi),
    emit: type => { for (const callback of [...listeners]) callback({ detail: { type, namespace: "30min", data: {} } }); },
    escape: () => { for (const callback of [...keyListeners]) callback({ key: "Escape" }); },
    advance(milliseconds) {
      clock += milliseconds;
      for (const [id, timer] of [...timers]) if (timer.at <= clock && timers.delete(id)) timer.callback();
    },
  };
}

const h = await harness();
h.provider.CalProvider();
h.provider.CalProvider();
await settle();
assert.equal(h.getApiCalls(), 1, "Strict Mode remount must reuse initialization");
assert.equal(h.sdkCalls.filter(([instruction]) => instruction === "init").length, 1);
assert.equal(h.sdkCalls[0][1], "30min", "Origin initialization must include its namespace");
assert.equal(h.sdkCalls[0][2].origin, "https://cal.com");
const ui = h.sdkCalls.find(([instruction]) => instruction === "ui")[1];
assert.equal(ui.layout, "month_view");
assert.equal(ui.theme, "light");
assert.equal(ui.hideEventTypeDetails, false);
assert.equal(h.sdkCalls.filter(([instruction]) => instruction === "preload").length, 1);
assert.equal(h.sdkCalls.find(([instruction]) => instruction === "preload")[1].calLink, "manasflow/30min");

const link = h.links.BookingLink({ children: "Book a Call" });
assert.equal(link.type, "a");
assert.equal(link.props.href, "https://cal.com/manasflow/30min");
assert.equal(link.props["data-cal-namespace"], "30min");
assert.equal(link.props["data-booking-link"], "manasflow/30min");
assert.equal(link.props["data-cal-link"], undefined, "Direct API triggers must not also invoke the delegated handler");
assert.equal(JSON.parse(link.props["data-cal-config"]).useSlotsViewOnSmallScreen, "true");
let event = clickEvent();
link.props.onClick(event);
await settle();
assert.equal(event.defaultPrevented, true, "Modal clicks must stay on the site");
assert.equal(event.propagationStopped, false, "Clicks must propagate normally");
assert.equal(h.modalCount(), 1);
const modal = h.sdkCalls.find(([instruction]) => instruction === "modal")[1];
assert.equal(modal.calOrigin, "https://cal.com");
assert.equal(modal.calLink, "manasflow/30min");
assert.equal(modal.config.layout, "month_view");
h.emit("linkReady");
h.advance(4000);
assert.equal(h.navigations.length, 0, "A ready calendar must not redirect later");
assert.equal(h.timers.size, 0);

for (const modifier of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) {
  event = clickEvent({ [modifier]: true });
  link.props.onClick(event);
  assert.equal(event.defaultPrevented, false);
}
event = clickEvent({ button: 1 });
link.props.onClick(event);
assert.equal(event.defaultPrevented, false);
const newTab = h.links.BookingLink({ children: "Book", target: "_blank" });
event = clickEvent(); newTab.props.onClick(event);
assert.equal(event.defaultPrevented, false);
assert.equal(h.modalCount(), 1, "Modified clicks and new tabs must preserve native navigation");

link.props.onClick(clickEvent()); await settle();
h.advance(3999);
assert.equal(h.navigations.length, 0);
h.advance(1);
assert.deepEqual(h.navigations, ["https://cal.com/manasflow/30min"], "An unresponsive calendar must fall back at four seconds");
link.props.onClick(clickEvent()); await settle();
h.emit("linkFailed"); h.advance(4000);
assert.equal(h.navigations.length, 2, "Failed calendars fall back once");
for (const ready of ["bookerReady", "bookerReopened", "__closeIframe"]) {
  link.props.onClick(clickEvent()); await settle();
  h.emit(ready); h.advance(4000);
  assert.equal(h.navigations.length, 2, `${ready} must clear the fallback`);
}
link.props.onClick(clickEvent()); await settle();
h.escape(); h.advance(4000);
assert.equal(h.navigations.length, 2, "Escape must cancel the pending redirect");
link.props.onClick(clickEvent()); link.props.onClick(clickEvent()); await settle();
assert.equal(h.timers.size, 1, "Rapid clicks must leave only the latest fallback active");
h.emit("linkReady");

assert.equal(h.links.ActionLink({ href: "/services", children: "Explore Solutions" }).props.href, "/services");
assert.notEqual(h.links.ActionLink({ href: "/contact", children: "Contact Us" }).type, h.links.BookingLink);
for (const label of ["Book a Free Strategy Call", "Free Consultation", "Schedule Consultation", "Book a Strategy Session", "Get Started Now"]) assert.equal(h.links.ActionLink({ href: "/contact", children: label }).type, h.links.BookingLink);
assert.equal(h.links.ActionLink({ href: "/consultation", children: "Talk through your roadmap" }).type, h.links.BookingLink);

const cold = await harness({ deferred: true });
cold.links.BookingLink({ children: "Book" }).props.onClick(clickEvent());
cold.advance(4000);
assert.equal(cold.navigations.length, 1, "A stalled SDK must also fall back");
cold.resolveApi(); await settle();
assert.equal(cold.modalCount(), 0, "A late SDK response must not open a modal after fallback");
const failed = await harness({ rejected: true });
failed.links.BookingLink({ children: "Book" }).props.onClick(clickEvent()); await settle();
assert.equal(failed.navigations.length, 1, "SDK rejection must fall back immediately");
assert.equal(failed.timers.size, 0);
console.log("Cal booking checks passed: namespaced origin, one initialization/preload, single popup, readiness/failure/4-second fallback, late SDK, Escape, rapid clicks, native new tabs, and non-booking navigation.");

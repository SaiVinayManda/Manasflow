import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const cache = new Map();
// Execute pure project data modules for audits without adding a runtime dependency.
export function loadTypescript(filename) {
  filename = path.resolve(filename);
  if (!fs.existsSync(filename)) filename += fs.existsSync(`${filename}.ts`) ? ".ts" : ".json";
  if (cache.has(filename)) return cache.get(filename).exports;
  const dataModule = { exports: {} };
  cache.set(filename, dataModule);
  if (filename.endsWith(".json")) dataModule.exports = JSON.parse(fs.readFileSync(filename, "utf8"));
  else {
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
    const localRequire = specifier => specifier.startsWith("@/") ? loadTypescript(path.join("src", specifier.slice(2))) : specifier.startsWith(".") ? loadTypescript(path.resolve(path.dirname(filename), specifier)) : require(specifier);
    new Function("require", "module", "exports", code)(localRequire, dataModule, dataModule.exports);
  }
  return dataModule.exports;
}

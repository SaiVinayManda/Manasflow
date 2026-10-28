import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const dirs = await fs.readdir("src/app", { withFileTypes: true });
const filenames = ["src/app/page.tsx", ...dirs.filter(dir => dir.isDirectory() && !dir.name.startsWith("[")).map(dir => `src/app/${dir.name}/page.tsx`)];
let changed = 0;
for (const filename of filenames) {
  let source = await fs.readFile(filename, "utf8").catch(() => null);
  if (!source) continue;
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let target;
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "metadata" && node.initializer && ts.isObjectLiteralExpression(node.initializer)) target = node.initializer;
    ts.forEachChild(node, visit);
  };
  visit(ast);
  if (!target || target.properties.some(property => ts.isSpreadAssignment(property) && property.expression.getText(ast).startsWith("pageMetadata("))) continue;
  const literalProperty = name => {
    const property = target.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(ast) === name);
    return property && ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer) ? property.initializer.text : "";
  };
  const route = filename === "src/app/page.tsx" ? "/" : `/${path.basename(path.dirname(filename))}`;
  const title = literalProperty("title") || (route === "/" ? "AI Transformation & Automation" : route.slice(1).replaceAll("-", " "));
  const description = literalProperty("description") || `Explore ${title.toLowerCase()} with ManasFlow. Practical AI automation, engineering, and resources for your business.`;
  const replacement = `{ ...${target.getText(ast)}, ...pageMetadata(${JSON.stringify(title)}, ${JSON.stringify(description)}, ${JSON.stringify(route)}) }`;
  source = source.slice(0, target.getStart(ast)) + replacement + source.slice(target.getEnd());
  if (!source.includes('from "@/lib/metadata"')) source = `import { pageMetadata } from "@/lib/metadata";\n${source}`;
  await fs.writeFile(filename, source);
  changed++;
}
console.log(`Added complete ManasFlow page metadata to ${changed} existing routes.`);

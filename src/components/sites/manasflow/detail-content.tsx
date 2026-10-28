import type { ReactNode } from "react";
import { Reveal } from "./shared";
import "./detail-content.css";

type Block = { kind: string; level?: number; text: string };
function BlockElement({ block }: { block: Block }) {
  const children: ReactNode = block.text;
  if (block.kind === "heading") {
    if (block.level === 1) return <h2>{children}</h2>;
    if (block.level === 2) return <h2>{children}</h2>;
    return <h3>{children}</h3>;
  }
  if (block.kind === "list") return <li>{children}</li>;
  if (block.kind === "quote") return <blockquote>{children}</blockquote>;
  return <p>{children}</p>;
}

export function DetailContent({ blocks }: { blocks: Block[] }) {
  let lists: Block[] = [];
  const output: ReactNode[] = [];
  const flush = () => { if (lists.length) { output.push(<ul key={`list-${output.length}`}>{lists.map((block, index) => <BlockElement key={index} block={block} />)}</ul>); lists = []; } };
  for (const [index, block] of blocks.entries()) {
    if (block.kind === "list") { lists.push(block); continue; }
    flush();
    output.push(<BlockElement key={`block-${index}`} block={block} />);
  }
  flush();
  return <div className="mf-detail-body"><Reveal><div className="mf-detail-prose">{output}</div></Reveal></div>;
}

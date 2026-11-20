import { ImageResponse } from "next/og";
import { getToolProduct, TOOL_PRODUCTS } from "@/lib/tool-products";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_PRODUCTS.map(({ slug }) => ({ slug }));
}

// Route-specific metadata points both OG and X cards at this cached image route.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolProduct(`/${slug}`);
  if (!tool) return new Response("Unknown tool", { status: 404 });
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0f0f15", color: "#f6f6fa", padding: "56px 64px", border: "2px solid #363641" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="66" height="48" viewBox="0 0 220 160"><path d="M20 110 L30 110 A20 20 0 0 0 50 90 A20 20 0 0 1 70 70 A20 20 0 0 1 90 90 A20 20 0 0 0 110 110 A20 20 0 0 0 130 90 A20 20 0 0 1 150 70 A20 20 0 0 1 170 90 A20 20 0 0 0 190 110 L200 110" fill="none" stroke="#a8aaef" strokeWidth="12" strokeLinecap="round" /></svg>
          <span style={{ fontSize: 30, fontWeight: 700 }}>ManasFlow</span>
        </div>
        <span style={{ fontSize: 20, color: "#bcbde6", border: "1px solid #4b4c70", padding: "10px 18px", borderRadius: 24 }}>Free to use</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <span style={{ fontSize: 18, color: "#a8aaef", textTransform: "uppercase", letterSpacing: 3, marginBottom: 18 }}>{tool.category}</span>
        <div style={{ display: "flex", fontSize: tool.title.length > 42 ? 52 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>{tool.title}</div>
        <div style={{ display: "flex", fontSize: 25, lineHeight: 1.5, color: "#bcbcc9", marginTop: 22 }}>{tool.subtitle}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #363641", paddingTop: 22, fontSize: 19, color: "#aaaabb" }}>
        <span>{`manasflow.com/${slug}`}</span><span>Explore. Plan. Build.</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

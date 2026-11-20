import { llmsMarkdown } from "@/lib/llms";

export const dynamic = "force-static";
export async function GET() {
  return new Response(await llmsMarkdown(), { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex, follow" } });
}

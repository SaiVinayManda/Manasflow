import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
export const metadata: Metadata = { ...{ title: "AI Model Directory", description: "Compare model context windows, providers, and published pricing with ManasFlow.", alternates: { canonical: "/models" } }, ...pageMetadata("AI Model Directory", "Compare model context windows, providers, and published pricing with ManasFlow.", "/models") };
export default function ModelsPage() { return <ModelDirectory />; }

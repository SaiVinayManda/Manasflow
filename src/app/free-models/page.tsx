import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
export const metadata: Metadata = { ...{ title: "Free AI Models Directory", description: "Browse free and open AI models by provider and family.", alternates: { canonical: "/free-models" } }, ...pageMetadata("Free AI Models Directory", "Browse free and open AI models by provider and family.", "/free-models") };
export default function FreeModelsPage() { return <ModelDirectory free />; }

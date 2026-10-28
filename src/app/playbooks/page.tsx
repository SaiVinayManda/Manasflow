import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { PlaybooksCatalog } from "@/components/sites/manasflow/catalogs";
import catalogData from "@/data/manasflow/catalogs.json";

export const metadata: Metadata = { ...{
  title: "Playbooks — AI & Automation Guides",
  description:
    "Step-by-step guides, frameworks and practical resources for AI engineering, coding, marketing and workflow automation with ManasFlow.",
  alternates: { canonical: "/playbooks" },
}, ...pageMetadata("Playbooks — AI & Automation Guides", "Step-by-step guides, frameworks and practical resources for AI engineering, coding, marketing and workflow automation with ManasFlow.", "/playbooks") };

export default function PlaybooksPage() {
  return (
    <PlaybooksCatalog
      cards={catalogData.playbooks.cards}
      categories={catalogData.playbooks.categories}
    />
  );
}

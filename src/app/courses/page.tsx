import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { CoursesCatalog } from "@/components/sites/manasflow/catalogs";
import catalogData from "@/data/manasflow/catalogs.json";

export const metadata: Metadata = { ...{
  title: "Courses",
  description:
    "Learn new skills and advance your work with ManasFlow’s AI and automation course collection.",
  alternates: { canonical: "/courses" },
}, ...pageMetadata("Courses", "Learn new skills and advance your work with ManasFlow’s AI and automation course collection.", "/courses") };

export default function CoursesPage() {
  return <PageSeo route="/courses">{<CoursesCatalog cards={catalogData.courses.cards} />}</PageSeo>;
}

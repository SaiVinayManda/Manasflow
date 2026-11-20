import { PageSeo } from "@/components/seo/page-seo";
import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { modelPageMetadata, modelPageNumber, modelPageRoute, type ModelSearchParams } from "@/lib/model-page";

type Props = { searchParams: ModelSearchParams };
export async function generateMetadata({ searchParams }: Props) {
  return modelPageMetadata("/directory", searchParams);
}

export default async function ModelPage({ searchParams }: Props) {
  const page = modelPageNumber("/directory", (await searchParams).page);
  return <PageSeo route={modelPageRoute("/directory", page)}><ModelDirectory free initialPage={page} basePath="/directory" /></PageSeo>;
}

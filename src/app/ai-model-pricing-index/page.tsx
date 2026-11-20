import { PageSeo } from "@/components/seo/page-seo";
import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { modelPageMetadata, modelPageNumber, modelPageRoute, type ModelSearchParams } from "@/lib/model-page";

type Props = { searchParams: ModelSearchParams };
export async function generateMetadata({ searchParams }: Props) {
  return modelPageMetadata("/ai-model-pricing-index", searchParams);
}

export default async function ModelPage({ searchParams }: Props) {
  const page = modelPageNumber("/ai-model-pricing-index", (await searchParams).page);
  return <PageSeo route={modelPageRoute("/ai-model-pricing-index", page)}><ModelDirectory pricing initialPage={page} basePath="/ai-model-pricing-index" /></PageSeo>;
}

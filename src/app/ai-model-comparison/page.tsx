import { PageSeo } from "@/components/seo/page-seo";
import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { modelPageMetadata, modelPageNumber, modelPageRoute, type ModelSearchParams } from "@/lib/model-page";

type Props = { searchParams: ModelSearchParams };
export async function generateMetadata({ searchParams }: Props) {
  return modelPageMetadata("/ai-model-comparison", searchParams);
}

export default async function ModelPage({ searchParams }: Props) {
  const page = modelPageNumber("/ai-model-comparison", (await searchParams).page);
  return <PageSeo route={modelPageRoute("/ai-model-comparison", page)}><ModelDirectory  initialPage={page} basePath="/ai-model-comparison" /></PageSeo>;
}

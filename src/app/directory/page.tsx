import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Free AI Model Directory", "Explore free AI APIs, open-weight models, access requirements, and setup instructions in the ManasFlow model directory.", "/directory");

export default function DirectoryPage() {
  return <ModelDirectory free />;
}

import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("AI Model Comparison", "Compare AI models side by side with ManasFlow: providers, context windows, published API prices, and a working monthly cost estimator.", "/ai-model-comparison");

export default function ModelComparisonPage() {
  return <ModelDirectory />;
}

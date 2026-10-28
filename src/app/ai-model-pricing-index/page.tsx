import { ModelDirectory } from "@/components/sites/manasflow/model-directory";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("AI Model Pricing Index", "Compare published AI API input and output pricing and calculate monthly token costs with ManasFlow's interactive pricing index.", "/ai-model-pricing-index");

export default function ModelPricingPage() {
  return <ModelDirectory pricing />;
}

import { pageMetadata } from "./metadata";
import { seoContent } from "./seo";
import models from "@/data/manasflow/models.json";

export type ModelSearchParams = Promise<{ page?: string | string[] }>;
export function modelPageNumber(route: string, input?: string | string[]) {
  const total = route === "/directory" ? models.freeModels.length : models.models.length;
  return Math.min(Math.ceil(total / 12), Math.max(1, Number.parseInt(Array.isArray(input) ? input[0] : input || "1", 10) || 1));
}
export const modelPageRoute = (route: string, page: number) => page > 1 ? `${route}?page=${page}` : route;
export async function modelPageMetadata(route: string, searchParams: ModelSearchParams) {
  const page = modelPageNumber(route, (await searchParams).page);
  const record = seoContent[modelPageRoute(route, page)];
  return pageMetadata(record.title, record.description, modelPageRoute(route, page));
}

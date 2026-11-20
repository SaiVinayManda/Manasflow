export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_KEY_PATH = "public/indexnow-key.txt";

export function indexNowPayload(origin, key, urls) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("IndexNow key must contain 8–128 letters, numbers, or dashes.");
  const site = new URL(origin);
  if (site.protocol !== "https:" || site.pathname !== "/" || site.search || site.hash || site.username || site.password) throw new Error("IndexNow requires the canonical HTTPS site origin.");
  const urlList = [...new Set(urls.map(input => {
    const url = new URL(input, site);
    if (url.origin !== site.origin || url.username || url.password) throw new Error(`URL is outside the canonical origin: ${input}`);
    url.hash = "";
    return url.href;
  }))];
  if (urlList.length === 0 || urlList.length > 10000) throw new Error("Each IndexNow request must contain 1–10,000 URLs.");
  return { host: site.host, key, keyLocation: new URL("/indexnow-key.txt", site).href, urlList };
}

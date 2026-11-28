import type { NextConfig } from "next";
import { ROUTE_ALIASES } from "./src/lib/seo-routes";

const nextConfig: NextConfig = {
  devIndicators: false,
  htmlLimitedBots: /.*/,
  output: "standalone",
  outputFileTracingExcludes: { "/*": ["./quarantine/**/*", "./temp/**/*"] },
  async redirects() {
    return Object.entries(ROUTE_ALIASES).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    const hasGa = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    const gaScript = hasGa ? " https://www.googletagmanager.com" : "";
    const gaConnect = hasGa ? " https://www.google-analytics.com https://region1.google-analytics.com" : "";
    const scriptPolicy =
      process.env.NODE_ENV === "production"
        ? `'self' 'unsafe-inline' https://app.cal.com https://cal.com https://va.vercel-scripts.com${gaScript}`
        : `'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://cal.com https://va.vercel-scripts.com${gaScript}`;
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptPolicy}; style-src 'self' 'unsafe-inline'; img-src 'self' data:${gaConnect}; font-src 'self' https://cal.com https://app.cal.com; connect-src 'self' https://app.cal.com https://cal.com https://vitals.vercel-insights.com${gaConnect}; media-src 'self'; frame-src https://app.cal.com https://cal.com; object-src 'none'; base-uri 'self'; form-action 'self' mailto: https://cal.com https://app.cal.com; frame-ancestors 'none'`,
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Link", value: '<https://manasflow.com/llms.txt>; rel="describedby", </.well-known/ard.json>; rel="ard"' },
        ],
      },
    ];
  },
};

export default nextConfig;

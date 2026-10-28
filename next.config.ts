import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "standalone",
  outputFileTracingExcludes: { "/*": ["./quarantine/**/*", "./temp/**/*"] },
  async headers() {
    const scriptPolicy =
      process.env.NODE_ENV === "production"
        ? "'self' 'unsafe-inline' https://app.cal.com https://cal.com"
        : "'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://cal.com";
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptPolicy}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://cal.com https://app.cal.com; connect-src 'self' https://app.cal.com https://cal.com; media-src 'self'; frame-src https://app.cal.com https://cal.com; object-src 'none'; base-uri 'self'; form-action 'self' mailto: https://cal.com https://app.cal.com; frame-ancestors 'none'`,
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;

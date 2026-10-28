import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header, Footer } from "@/components/sites/manasflow/chrome";
import { site } from "@/lib/site";
import { CalProvider } from "@/components/sites/manasflow/cal-provider";
import "./globals.css";

const lexend = localFont({
  src: "../../public/sites/manasflow/fonts/793968fa3513f5d6-s.p.woff2",
  variable: "--font-lexend",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#0f0f15", colorScheme: "dark" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "ManasFlow | AI Transformation & Automation", template: "%s | ManasFlow" },
  description: site.description,
  applicationName: site.name,
  manifest: "/site.webmanifest",
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  icons: { icon: "/sites/manasflow/favicon.svg", apple: "/sites/manasflow/apple-touch-icon.png" },
  openGraph: {
    type: "website", siteName: site.name, locale: "en_US", url: site.url,
    title: "ManasFlow | AI Transformation & Automation", description: site.description,
    images: [{ url: "/sites/manasflow/social-card.png", width: 1200, height: 630, alt: "ManasFlow — Scale your business with AI automation" }],
  },
  twitter: { card: "summary_large_image", title: "ManasFlow | AI Transformation & Automation", description: site.description, images: ["/sites/manasflow/social-card.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`dark ${lexend.variable}`}>
    <head>
      <link rel="preconnect" href="https://cal.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://cal.com" />
      <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://app.cal.com" />
    </head>
    <body>
      <CalProvider />
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Organization", name: site.name,
        url: site.url, email: site.email, logo: `${site.url}/sites/manasflow/logo_no_nodes.svg`,
        description: site.description,
        contactPoint: { "@type": "ContactPoint", contactType: "Customer Service", email: site.email },
      }).replace(/</g, "\\u003c") }} />
    </body>
  </html>;
}

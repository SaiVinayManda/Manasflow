import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header, Footer } from "@/components/sites/manasflow/chrome";
import { site } from "@/lib/site";
import { HubNavigation } from "@/components/seo/hub-navigation";
import { FloatingWhatsApp } from "@/components/sites/manasflow/whatsapp-contact";
import "./globals.css";
import "@/components/sites/manasflow/whatsapp-contact.css";

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
  // Next's Metadata API emits these explicit links into the server-rendered head.
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/logo.svg", type: "image/svg+xml", sizes: "any", media: "(prefers-color-scheme: light)" },
      { url: "/sites/manasflow/favicon.svg", type: "image/svg+xml", sizes: "any", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: { url: "/favicon.ico", type: "image/x-icon" },
    apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
  },
  openGraph: {
    type: "website", siteName: site.name, locale: "en_US", url: site.url,
    title: "ManasFlow | AI Transformation & Automation", description: site.description,
    images: [{ url: "/sites/manasflow/social-card.png", width: 1200, height: 630, alt: "ManasFlow — Scale your business with AI automation" }],
  },
  twitter: { card: "summary_large_image", title: "ManasFlow | AI Transformation & Automation", description: site.description, images: ["/sites/manasflow/social-card.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`dark ${lexend.variable}`}>
    <body>
      <a href="#main" className="skip-link" data-nosnippet=""><span data-nosnippet="">Skip to content</span></a>
      <Header navigation={<HubNavigation placement="header" />} />
      <main id="main">{children}</main>
      <div data-nosnippet=""><Footer navigation={<HubNavigation placement="footer" />} /></div>
      <FloatingWhatsApp />
    </body>
  </html>;
}

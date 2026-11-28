import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Script from "next/script";
import { Header, Footer } from "@/components/sites/manasflow/chrome";
import { site } from "@/lib/site";
import { HubNavigation } from "@/components/seo/hub-navigation";
import { AttributionTracker } from "@/components/sites/manasflow/attribution-tracker";
import { FloatingWhatsApp } from "@/components/sites/manasflow/whatsapp-contact";

const ConsentBanner = dynamic(() =>
  import("@/components/sites/manasflow/consent-banner").then(mod => mod.ConsentBanner),
);
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return <html lang="en" className={`dark ${lexend.variable}`}>
    <body>
      {gaId && <>
        <Script id="ga4-consent-default" strategy="beforeInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}</Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}try{var c=localStorage.getItem('mf_analytics_consent_v1');if(c==='granted')gtag('consent','update',{analytics_storage:'granted'});}catch(e){}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
      </>}
      <AttributionTracker />
      <a href="#main" className="skip-link" data-nosnippet=""><span data-nosnippet="">Skip to content</span></a>
      <Header navigation={<HubNavigation placement="header" />} />
      <main id="main">{children}</main>
      <div data-nosnippet=""><Footer navigation={<HubNavigation placement="footer" />} /></div>
      <FloatingWhatsApp />
      {gaId && <ConsentBanner />}
    </body>
  </html>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "9H - Branding, Tech, Creative & Digital Marketing",
  description:
    "We build the tech that powers your business. Turning complexity into clarity, at speed.",
  icons: { icon: "/sites/9hdigital/cropped-Favicon-1-32x32.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

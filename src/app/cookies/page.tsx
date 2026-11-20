import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/manasflow/legal";

export const metadata: Metadata = { ...{
  title: "Cookies and website storage",
  alternates: { canonical: "/cookies" },
}, ...pageMetadata("Cookies and website storage", "Explore cookies and website storage with ManasFlow. Practical AI automation, engineering, and resources for your business.", "/cookies") };
const sections: LegalSection[] = [
  {
    id: "setup",
    title: "Current app setup",
    content: (
      <p>
        This application does not set cookies, local storage or similar
        identifiers for analytics, advertising or personalisation. There are no
        analytics tags, advertising pixels, embedded videos or chat widgets.
        Booking uses Cal.com: its embed script loads on the site and its
        scheduling frame opens when you select a booking button. Cal.com may use
        its own storage for the booking experience. Fonts and illustrations are served from the site itself.
        The service selector and menu keep their state only in memory while the
        page is open.
      </p>
    ),
  },
  {
    id: "hosting",
    title: "Hosting and email",
    content: (
      <p>
        The final hosting configuration still needs review for any security or
        infrastructure cookies it may add. Email links open your email
        application, which has its own storage and privacy settings. See our{" "}
        <Link href="/privacy">draft privacy notice</Link> for the other details
        awaiting confirmation.
      </p>
    ),
  },
  {
    id: "changes",
    title: "If the setup changes",
    content: (
      <p>
        Before adding an analytics, marketing or other optional integration, we
        will review the data it uses, the legal basis, provider arrangements and
        any consent requirement. A future integration must not load optional
        tracking before the appropriate permission is obtained. No old consent
        choice is treated as permission for a new provider.
      </p>
    ),
  },
];
export default function CookiesPage() {
  return <PageSeo route="/cookies">{(
    <LegalPage
      title="Cookies & storage"
      intro="This notice describes local website storage and the Cal.com scheduling integration."
      sections={sections}
    />
  )}</PageSeo>;
}

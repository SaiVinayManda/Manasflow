import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/manasflow/legal";
import { contactHref, site } from "@/lib/site";

export const metadata: Metadata = { ...{
  title: "Website terms — draft",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
}, ...pageMetadata("Website terms — draft", "Explore website terms — draft with ManasFlow. Practical AI automation, engineering, and resources for your business.", "/terms") };

const sections: LegalSection[] = [
  {
    id: "operator",
    title: "1. About this website",
    content: (
      <p>
        This website presents ManasFlow, registered in Milan, Italy, and working
        remotely across Europe. Contact <a href={contactHref}>{site.email}</a>{" "}
        with questions. The full registered entity name, postal address and
        registration details are awaiting confirmation.
      </p>
    ),
  },
  {
    id: "scope",
    title: "2. Website information and project work",
    content: (
      <p>
        The website is an introduction to the kinds of work we can discuss.
        Sending an email does not place an order or create a services agreement.
        Scope, deliverables, fees, timing, responsibilities and any
        data-processing terms for a project must be agreed separately in
        writing. There is no online checkout or subscription on this website.
      </p>
    ),
  },
  {
    id: "use",
    title: "3. Using the website",
    content: (
      <p>
        Please use the site lawfully. Do not introduce malicious software,
        interfere with its operation, attempt unauthorised access, impersonate
        someone else or use the contact address for unlawful or abusive
        messages. Ordinary viewing and sharing links are welcome.
      </p>
    ),
  },
  {
    id: "content",
    title: "4. Content and intellectual property",
    content: (
      <p>
        The ManasFlow name, original artwork, copy and design are presented for
        this website. Third-party software and typefaces remain subject to their
        own licences; the self-hosted fonts include their SIL Open Font License
        notices. Permission to view the site does not grant a licence to reuse
        protected material commercially. Project-specific ownership and
        licensing belong in the relevant written agreement.
      </p>
    ),
  },
  {
    id: "care",
    title: "5. Accuracy and availability",
    content: (
      <p>
        Website content may change as our work develops. It is general
        information and is not a guaranteed project outcome, quotation or
        professional advice. We may update or interrupt the site for
        maintenance. Nothing here excludes liability or limits a right where
        doing so would be unlawful, including mandatory consumer rights.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "6. Privacy and contact",
    content: (
      <p>
        The <Link href="/privacy">privacy notice</Link> explains the current
        data-handling setup and its open confirmation items. Email links open
        your own email application. Please do not send confidential project
        material, credentials or sensitive personal information before agreeing
        a suitable way to exchange it.
      </p>
    ),
  },
  {
    id: "law",
    title: "7. Applicable law and questions",
    content: (
      <p>
        Italian law applies to these website terms to the extent permitted by
        applicable law. Mandatory protections in another relevant jurisdiction
        remain unaffected. No exclusive forum or waiver of consumer protections
        is imposed by this draft. Please contact us first about a question or
        concern. Terms for paid work will be agreed separately.
      </p>
    ),
  },
  {
    id: "updates",
    title: "8. Updates",
    content: (
      <p>
        We may revise these website terms and show the revision date on this
        page. A change to this page does not by itself change an existing signed
        project agreement. The current draft requires confirmation of the
        operator details and review before publication.
      </p>
    ),
  },
];

export default function TermsPage() {
  return <PageSeo route="/terms">{(
    <LegalPage
      title="Website terms"
      intro="The basis for using this website. Any project begins with its own conversation and written agreement."
      sections={sections}
      draft
    />
  )}</PageSeo>;
}

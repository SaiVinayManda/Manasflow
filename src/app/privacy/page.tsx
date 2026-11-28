import { PageSeo } from "@/components/seo/page-seo";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/manasflow/legal";
import { contactHref, site } from "@/lib/site";

export const metadata: Metadata = { ...{
  title: "Privacy notice — draft",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
}, ...pageMetadata("Privacy notice — draft", "Explore privacy notice — draft with ManasFlow. Practical AI automation, engineering, and resources for your business.", "/privacy") };

const sections: LegalSection[] = [
  {
    id: "controller",
    title: "1. Who is responsible",
    content: (
      <p>
        ManasFlow is registered in Milan, Italy, and works remotely across
        Europe. For privacy questions or requests, email{" "}
        <a href={contactHref}>{site.email}</a>. The full legal entity name and
        registered postal address will be added after confirmation; no separate
        data protection officer has been identified for this draft.
      </p>
    ),
  },
  {
    id: "information",
    title: "2. Information involved",
    content: (
      <>
        <p>
          If you email us or submit the contact, ROI roadmap, or newsletter
          forms, your submission can include your name, email address,
          organisation, service interest, and any details you choose to share.
          Submissions are sent to our enquiry intake handler (or, when no direct
          delivery webhook/provider is configured in an environment, prepared as
          a draft in your own email application). Booking buttons open a Cal.com
          calendar for the ManasFlow 30-minute event; information you enter into
          that calendar is submitted through Cal.com to arrange the appointment.
        </p>
        <p>
          Delivering a web page involves connection data such as an IP address,
          requested address, time and browser headers. The hosting provider’s
          actual logging settings and retention need confirmation. Optional
          first-party Google Analytics measurement loads with Google Consent
          Mode v2 defaults only when explicitly configured, alongside session
          landing/UTM attribution attached only upon form submission (never PII
          in analytics). Newsletter recipients may unsubscribe at any time via{" "}
          <code>/api/newsletter/unsubscribe</code>. The Cal.com embed script
          loads on the site, and its scheduling frame opens when you choose to
          book a call.
        </p>
      </>
    ),
  },
  {
    id: "purpose",
    title: "3. Why information is used",
    content: (
      <ul>
        <li>
          To discuss a project you request or take steps before a contract: GDPR
          Article 6(1)(b), where applicable.
        </li>
        <li>
          To answer general correspondence and protect the website: legitimate
          interests under Article 6(1)(f), balanced against your rights.
        </li>
        <li>To meet applicable legal obligations: Article 6(1)(c).</li>
      </ul>
    ),
  },
  {
    id: "access",
    title: "4. Access and service providers",
    content: (
      <p>
        Access should be limited to people handling the enquiry and providers
        needed for hosting, email, administration or professional advice. The
        provider names, processing agreements and access arrangements are
        awaiting confirmation. We do not add an enquiry to a marketing list
        through this website.
      </p>
    ),
  },
  {
    id: "retention",
    title: "5. How long information is kept",
    content: (
      <p>
        Enquiry information should be kept only while needed to respond, discuss
        the proposed work and handle related follow-up. Information needed for
        an agreed project, legal duties or a legal claim may need a different
        period. The business must confirm its deletion schedule, mailbox
        settings and host log periods before this notice is final.
      </p>
    ),
  },
  {
    id: "rights",
    title: "6. Your rights",
    content: (
      <>
        <p>
          Depending on the circumstances, you can request access, correction,
          deletion, restriction or portability, and object to processing based
          on legitimate interests. If processing relies on consent, you can
          withdraw it without affecting earlier lawful processing. Email us to
          exercise a right. We may need proportionate information to verify a
          request and will respond within the GDPR time limits.
        </p>
        <p>
          You can complain to the{" "}
          <a
            href="https://www.garanteprivacy.it/"
            target="_blank"
            rel="noreferrer"
          >
            Italian data protection authority, the Garante
          </a>
          , or another competent supervisory authority, including in the EU
          country where you live or work.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "7. International transfers",
    content: (
      <p>
        Provider locations and transfers outside the European Economic Area have
        not yet been confirmed. Any such transfer must have an applicable GDPR
        safeguard, such as an adequacy decision or appropriate contractual
        protections, with further measures where required. Contact us for
        details before sharing information if this affects your decision.
      </p>
    ),
  },
  {
    id: "choices",
    title: "8. Choices and website storage",
    content: (
      <>
        <p>
          Contact is voluntary. Without the information needed to understand an
          enquiry, we may be unable to answer it. The website does not implement
          automated decisions about people or profiling.
        </p>
        <p>
          The current app sets no analytics or advertising cookies and does not
          use browser storage to track visitors. Fonts and artwork are hosted
          with the site. See the <Link href="/cookies">cookie notice</Link>.
          Changes to these arrangements require a fresh review of this notice.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return <PageSeo route="/privacy">{(
    <LegalPage
      title="Privacy notice"
      intro="A clear account of the current website setup, how enquiries are handled, and the details still being confirmed."
      sections={sections}
      draft
    />
  )}</PageSeo>;
}

import Link from "next/link";
import { productLinks } from "@/data/manasflow/navigation";
import { PageSeo } from "@/components/seo/page-seo";
import { SubpageHero } from "@/components/sites/manasflow/subpage-shared";
import { hubMetadata } from "@/lib/metadata";

export const metadata = hubMetadata("/platform");

export default function PlatformPage() {
  return <PageSeo route="/platform"><SubpageHero badge="ManasFlow" title="Our Platform" /><nav className="mf-container seo-hub-links" aria-label="Platform products"><ul>{productLinks.map(product => <li key={product.href}><Link href={product.href}><h2>{product.label}</h2><p>{product.detail}</p></Link></li>)}</ul></nav></PageSeo>;
}

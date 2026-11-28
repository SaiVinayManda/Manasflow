import type { ReactNode } from "react";
import { WHATSAPP_CHAT_URL, WHATSAPP_LABEL } from "@/lib/contact";

export function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.02 0C5.4 0 .02 5.38.02 12c0 2.11.55 4.17 1.6 5.99L0 24l6.16-1.62A12 12 0 0 0 12.02 24H12c6.62 0 12-5.38 12-12 0-3.2-1.24-6.21-3.48-8.52ZM12.02 22a9.98 9.98 0 0 1-5.09-1.39l-.36-.21-3.66.96.98-3.57-.24-.37A9.95 9.95 0 0 1 2.02 12c0-5.51 4.49-10 10-10a9.94 9.94 0 0 1 7.07 2.93A9.94 9.94 0 0 1 22.02 12c0 5.51-4.49 10-10 10Zm5.48-7.49c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.3 1.26.48 1.69.61.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
  </svg>;
}

export function WhatsAppLink({ children = "Chat on WhatsApp", className = "", iconOnly = false }: { children?: ReactNode; className?: string; iconOnly?: boolean }) {
  return <a className={`mf-whatsapp-link ${className}`} href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" {...(iconOnly ? { "aria-label": WHATSAPP_LABEL } : {})}>
    <WhatsAppIcon />{!iconOnly && <span>{children}</span>}
  </a>;
}

export function ContactActions({ children }: { children: ReactNode }) {
  return <span className="mf-contact-actions"><span className="mf-contact-row">{children}<WhatsAppLink /></span></span>;
}

export function FloatingWhatsApp() {
  return <div className="mf-whatsapp-floating" data-nosnippet=""><WhatsAppLink iconOnly /></div>;
}

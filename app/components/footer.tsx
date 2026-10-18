import { site } from "../data/site";
import { footerCopy } from "../data/content";
import { WHATSAPP_LINK } from "../lib/constants";
import { Instagram, TikTok, WhatsApp } from "./icons";

// Konstanta tahun agar halaman tetap statis (Next.js 16 melarang new Date() saat prerender).
const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-ink py-12 text-paper md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="mb-4 font-display text-lg tracking-wide">
              {site.brand.name}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-paper/70">
              {site.brand.tagline}
            </p>
          </div>

          {/* Tautan */}
          <nav aria-label="Tautan footer">
            <h3 className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-gold-400">
              {footerCopy.linksHeading}
            </h3>
            <ul className="space-y-3 text-sm text-paper/70">
              {site.nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-sm transition-colors duration-150 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak */}
          <div>
            <h3 className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-gold-400">
              {footerCopy.connectHeading}
            </h3>
            <ul className="space-y-3 text-sm text-paper/70">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm transition-colors duration-150 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                >
                  <WhatsApp className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm transition-colors duration-150 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm transition-colors duration-150 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                >
                  <TikTok className="h-4 w-4" aria-hidden="true" />
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-paper/15 pt-8 text-sm text-paper/70 md:flex-row md:items-center">
          <p>
            © {CURRENT_YEAR} {site.brand.name}. {footerCopy.rights}
          </p>
          <p>{footerCopy.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

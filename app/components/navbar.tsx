"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { site } from "../data/site";
import { common } from "../data/content";
import { assetUrl, WHATSAPP_LINK } from "../lib/constants";
import ButtonLink from "./ui/button-link";
import { WhatsApp } from "./icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-4 top-4 z-50">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto max-w-6xl rounded-lg border border-ink/10 bg-paper shadow-sm"
      >
        <div className="flex items-center gap-3 px-4 py-2.5 md:gap-8 md:px-5 md:py-3.5">
          {/* Logo kedai */}
          <Link
            href="/#home"
            aria-label={`${site.brand.name} — kembali ke atas`}
            className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(site.brand.logo)}
              alt={site.brand.name}
              width={512}
              height={512}
              className="h-9 w-9 md:h-10 md:w-10"
            />
          </Link>

          {/* Nama kedai — versi HP saja, di tengah bar (font judul) */}
          <span className="flex-1 text-center font-display text-2xl tracking-wide text-ink md:hidden">
            {site.brand.name}
          </span>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm font-medium text-ink/80 transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Kanan: CTA desktop · tombol menu mobile */}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">
              <ButtonLink
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="px-4 py-2.5"
              >
                <WhatsApp className="h-4 w-4" aria-hidden="true" />
                {common.whatsappCta}
              </ButtonLink>
            </div>

            <button
              type="button"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-md text-ink transition-colors duration-150 hover:bg-cream active:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 md:hidden"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="motion-safe:animate-[menu-in_180ms_ease-out] space-y-1 border-t border-ink/10 px-5 py-4 md:hidden">
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink/80 transition-colors duration-150 hover:bg-cream hover:text-sambal-700 active:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="mt-3 w-full"
            >
              <WhatsApp className="h-4 w-4" aria-hidden="true" />
              {common.whatsappCta}
            </ButtonLink>
          </div>
        )}
      </nav>
    </header>
  );
}

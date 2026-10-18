"use client";

import { useEffect, useState } from "react";
import { WhatsApp } from "./icons";
import { common } from "../data/content";
import { WHATSAPP_LINK } from "../lib/constants";

/**
 * Tombol WhatsApp melayang — muncul setelah pengunjung menggulir
 * melewati hero, supaya tombol pesan selalu dalam jangkauan.
 */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={common.whatsappCta}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-5 bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] z-40 grid h-14 w-14 place-items-center rounded-full bg-sambal-600 text-paper shadow-lg transition-opacity duration-200 hover:bg-sambal-700 active:bg-sambal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 motion-reduce:transition-none ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <WhatsApp className="h-7 w-7" />
    </a>
  );
}

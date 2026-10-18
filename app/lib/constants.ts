import { site } from "../data/site";

export const WHATSAPP_NUMBER = site.contact.whatsappNumber;

/** Buat link WhatsApp dengan pesan otomatis terisi. */
export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_LINK = whatsappLink(
  `Halo ${site.brand.name}, saya mau bertanya soal menu dan pesanan.`
);

/* Peta Google — otomatis mengikuti site.contact.mapsQuery */
/* URL embed kanonik Google — merespons 200 langsung, tanpa redirect, aman di-iframe. */
export const MAPS_EMBED_URL = `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${site.contact.mapsQuery}!6i14`;

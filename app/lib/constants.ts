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

/* ============================================================
 * GAMBAR → OTOMATIS: LOKAL vs VERCEL
 * ============================================================
 * - Di laptop (npm run dev) : gambar dibaca dari folder public/
 *   → src="/logo.webp"   (langsung dari path)
 * - Di Vercel (produksi)    : gambar diambil LANGSUNG dari repo
 *   GitHub → src="https://raw.githubusercontent.com/.../logo.webp"
 *
 * Saklarnya ada di file .env.production (NEXT_PUBLIC_ASSET_BASE)
 * yang hanya terpakai saat build produksi — kode komponen tidak
 * perlu diubah sama sekali.
 * ============================================================ */
export function assetUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_ASSET_BASE || "";
  return `${base}${path}`;
}

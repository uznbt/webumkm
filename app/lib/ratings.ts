import { site } from "../data/site";

/** Satu ulasan seperti yang dikirim backend rating. */
export interface Rating {
  name: string;
  rating: number;
  comment: string;
  /** Tanggal format "yyyy-MM-dd" (waktu WIB), boleh kosong. */
  date?: string;
}

/** Fitur rating hanya aktif kalau backend sudah dipasang. */
export function ratingsEnabled() {
  return Boolean(site.ratingsEndpoint);
}

/** Kirim rating baru ke Google Sheet (lewat Apps Script). */
export async function submitRating(input: {
  rating: number;
  name?: string;
  comment?: string;
  /** Jebakan bot — harus selalu kosong. */
  website?: string;
}): Promise<void> {
  const res = await fetch(site.ratingsEndpoint, {
    method: "POST",
    // text/plain dipakai sengaja: aplikasi Apps Script tidak mendukung
    // preflight CORS, jadi kita hindari lewat "simple request".
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json().catch(() => null);
  if (!data || data.ok !== true) {
    throw new Error((data && data.error) || "gagal mengirim");
  }
}

/** Ambil ulasan yang sudah disetujui (untuk ditampilkan di situs). */
export async function fetchApprovedRatings(): Promise<Rating[]> {
  const res = await fetch(site.ratingsEndpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json().catch(() => null);
  if (!data || data.ok !== true || !Array.isArray(data.items)) {
    throw new Error("data ulasan tidak valid");
  }
  return data.items as Rating[];
}

/** Ubah "2026-10-18" → "18 Okt 2026" tanpa masalah zona waktu. */
export function formatRatingDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

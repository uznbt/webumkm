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

/** Selang penyegaran daftar ulasan (ms). 20 detik = cadangan kalau real-time putus. */
export const RATING_REFRESH_MS = 20_000;

/**
 * Nama kanal & event real-time — HARUS sama dengan yang dipakai di
 * gas/rating-backend.gs.
 */
export const RATINGS_CHANNEL = "kedai-raos";
export const RATINGS_EVENT = "reviews-updated";

/** Real-time aktif hanya kalau backend & kunci publik Pusher terisi. */
export function realtimeEnabled() {
  return ratingsEnabled() && Boolean(site.pusherKey && site.pusherCluster);
}

/**
 * Dengarkan sinyal "ada perubahan ulasan" dari Pusher.
 * Mengembalikan fungsi untuk berhenti mendengarkan.
 * (pusher-js dimuat saat dibutuhkan saja — tidak ikut bundel awal.)
 */
export async function subscribeToRatingUpdates(
  onUpdate: () => void
): Promise<() => void> {
  const { default: Pusher } = await import("pusher-js");
  const client = new Pusher(site.pusherKey, {
    cluster: site.pusherCluster, // kanal publik — tidak perlu auth endpoint
  });
  const channel = client.subscribe(RATINGS_CHANNEL);
  channel.bind(RATINGS_EVENT, onUpdate);

  return () => {
    channel.unbind(RATINGS_EVENT, onUpdate);
    client.unsubscribe(RATINGS_CHANNEL);
    client.disconnect();
  };
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

/** Ambil daftar ulasan untuk ditampilkan di situs. */
export async function fetchRatings(): Promise<Rating[]> {
  // Penanda waktu (?t=) itu penting: balasan GET dari Apps Script bisa
  // tersangkut cache Google selama beberapa menit — dengan URL yang
  // selalu baru, data yang diterima selalu yang paling terbaru.
  const url =
    site.ratingsEndpoint +
    (site.ratingsEndpoint.includes("?") ? "&" : "?") +
    "t=" +
    Date.now();
  const res = await fetch(url, { cache: "no-store" });
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

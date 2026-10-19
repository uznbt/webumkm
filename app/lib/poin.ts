import { site } from "../data/site";

/*
 * ============================================================
 *  KARTU RAOS — logika klien poin & kupon
 * ============================================================
 * Semua permintaan dikirim ke backend Apps Script yang sama
 * dengan rating & chat (site.ratingsEndpoint). Tidak ada kata
 * sandi yang disimpan di browser — hanya token sesi.
 */

export interface Anggota {
  nomor: string;
  nama: string;
  poin: number;
  status?: string;
  sejak?: string;
  wa?: string;
}

export interface Hadiah {
  nama: string;
  poin: number;
  keterangan: string;
}

export interface Kupon {
  kode: string;
  hadiah: string;
  poin: number;
  status: "aktif" | "terpakai" | "kedaluwarsa" | string;
  sampai: string;
  dibuat?: string;
  dipakai?: string;
}

export interface RiwayatPoin {
  waktu: string;
  jenis: "masuk" | "tukar" | string;
  jumlah: number;
  saldo: number;
  keterangan: string;
}

export interface PoinSaya {
  anggota: Anggota;
  hadiah: Hadiah[];
  kupon: Kupon[];
  riwayat: RiwayatPoin[];
}

export interface HasilMasuk {
  token: string;
  anggota: Anggota;
}

export interface HasilKasir {
  token: string;
  pinDefault: boolean;
}

/** Program poin ikut aktif kalau backend sudah dipasang. */
export function poinEnabled() {
  return Boolean(site.ratingsEndpoint);
}

const DEVICE_KEY = "kedai-raos-device";
const TOKEN_ANGGOTA_KEY = "kedai-raos-poin";
const TOKEN_KASIR_KEY = "kedai-raos-kasir";

/** ID acak per perangkat — dipakai server untuk membatasi percobaan PIN. */
function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/**
 * Kirim satu permintaan ke backend. Melempar Error dengan pesan
 * yang sudah siap ditampilkan (mis. "PIN kasir salah.").
 */
async function panggilPoin<T>(body: Record<string, unknown>): Promise<T> {
  if (!site.ratingsEndpoint) throw new Error("nonaktif");

  let res: Response;
  try {
    res = await fetch(site.ratingsEndpoint, {
      method: "POST",
      // text/plain sengaja dipakai supaya tidak kena preflight CORS
      // (Apps Script tidak mendukung preflight).
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...body, device: deviceId() }),
    });
  } catch {
    throw new Error("jaringan");
  }

  if (!res.ok) throw new Error("jaringan");

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!data || data.ok !== true) {
    throw new Error(String((data && data.error) || "gangguan"));
  }
  return data as T;
}

// ── Sesi anggota ────────────────────────────────────────────

/** Simpan token login anggota di browser ini. */
export function simpanTokenAnggota(token: string) {
  try {
    localStorage.setItem(TOKEN_ANGGOTA_KEY, token);
  } catch {
    /* abaikan — sesi tetap jalan sampai halaman ditutup */
  }
}

export function bacaTokenAnggota(): string | null {
  try {
    return localStorage.getItem(TOKEN_ANGGOTA_KEY);
  } catch {
    return null;
  }
}

export function hapusTokenAnggota() {
  try {
    localStorage.removeItem(TOKEN_ANGGOTA_KEY);
  } catch {
    /* abaikan */
  }
}

// ── Sesi kasir ──────────────────────────────────────────────

/** Token kasir disimpan per-tab (sessionStorage) — tidak menempel di perangkat. */
export function simpanTokenKasir(token: string) {
  try {
    sessionStorage.setItem(TOKEN_KASIR_KEY, token);
  } catch {
    /* abaikan */
  }
}

export function bacaTokenKasir(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KASIR_KEY);
  } catch {
    return null;
  }
}

export function hapusTokenKasir() {
  try {
    sessionStorage.removeItem(TOKEN_KASIR_KEY);
  } catch {
    /* abaikan */
  }
}

// ── Anggota ─────────────────────────────────────────────────

export function masukAnggota(nomor: string, pin: string) {
  return panggilPoin<HasilMasuk>({ action: "poinMasuk", nomor, pin });
}

export function ambilPoinSaya(token: string) {
  return panggilPoin<PoinSaya>({ action: "poinSaya", token });
}

export function tukarHadiah(token: string, hadiah: string) {
  return panggilPoin<{ kupon: Kupon; saldo: number }>({
    action: "poinTukar",
    token,
    hadiah,
  });
}

export function gantiPinAnggota(
  token: string,
  pinLama: string,
  pinBaru: string
) {
  return panggilPoin<{ ok: true }>({
    action: "poinGantiPin",
    token,
    pinLama,
    pinBaru,
  });
}

// ── Kasir ───────────────────────────────────────────────────

export function masukKasir(pin: string) {
  return panggilPoin<HasilKasir>({ action: "kasirMasuk", pin });
}

export function cekKasir(token: string) {
  return panggilPoin<{ pinDefault: boolean }>({ action: "kasirCek", token });
}

export function cariAnggotaKasir(token: string, cari: string) {
  return panggilPoin<{ hasil: Anggota[] }>({
    action: "kasirCari",
    token,
    cari,
  }).then((d) => d.hasil);
}

export function daftarAnggotaBaru(token: string, nama: string, wa: string) {
  return panggilPoin<{ nomor: string; pin: string; nama: string }>({
    action: "kasirDaftar",
    token,
    nama,
    wa,
  });
}

export function tambahPoin(
  token: string,
  nomor: string,
  porsi: number,
  keterangan: string
) {
  return panggilPoin<{ anggota: Anggota; tambah: number }>({
    action: "kasirTambah",
    token,
    nomor,
    porsi,
    keterangan,
  });
}

export function pakaiKupon(token: string, kode: string) {
  return panggilPoin<{
    kupon: Kupon;
    anggota: Anggota | null;
  }>({ action: "kasirKupon", token, kode });
}

export function resetPinAnggota(token: string, nomor: string) {
  return panggilPoin<{ nomor: string; pin: string }>({
    action: "kasirResetPin",
    token,
    nomor,
  });
}

// ── Tampilan ────────────────────────────────────────────────

/** Ubah pesan error backend menjadi kalimat yang ramah. */
export function pesanGalat(err: unknown): string {
  const kode = err instanceof Error ? err.message : "";
  if (kode === "sesi") {
    return "Sesi kamu sudah berakhir. Masuk lagi ya.";
  }
  if (kode === "jaringan") {
    return "Tidak bisa terhubung. Periksa internet lalu coba lagi.";
  }
  if (kode === "nonaktif" || kode === "rating tidak valid" || kode === "aksi tidak dikenal") {
    return "Program poin belum diaktifkan. Hubungi pengelola kedai.";
  }
  if (kode === "gangguan") {
    return "Lagi ada gangguan. Coba lagi sebentar ya.";
  }
  return kode || "Terjadi kesalahan. Coba lagi ya.";
}

/** "2026-10-19" → "19 Okt 2026" tanpa masalah zona waktu. */
export function formatTanggal(ymd?: string): string {
  if (!ymd) return "";
  const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

/** Waktu ISO dari server → "19 Okt 2026, 15.04" (WIB). */
export function formatWaktu(iso?: string): string {
  if (!iso) return "";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(t);
}

export function formatPoin(n: number): string {
  try {
    return new Intl.NumberFormat("id-ID").format(n);
  } catch {
    return String(n);
  }
}

/** Normalkan nomor anggota untuk tampilan ("kr1" → "KR-0001"). */
export function rapikanNomor(nomor: string): string {
  const s = nomor.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = s.match(/^KR0*(\d{1,6})$/);
  return m ? "KR-" + String(Number(m[1])).padStart(4, "0") : nomor.trim();
}

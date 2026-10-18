/*
 * ============================================================
 *  STATUS BUKA/TUTUP KEDAI — dihitung dari jam di site.ts
 * ============================================================
 * Semua perhitungan memakai zona waktu WIB (waktu kedai),
 * bukan zona waktu pengunjung — jadi benar dari mana pun dilihat.
 */

export interface HoursEntry {
  days: number[];
  open: string;
  close: string;
}

export interface OpenInfo {
  /** true = sedang buka. */
  open: boolean;
  /** Menit acuan: jam tutup (kalau buka) atau jam buka berikutnya (kalau tutup). */
  refMinutes: number;
  /** 0 = hari ini, 1 = besok, … */
  daysAhead: number;
}

/** Waktu sekarang menurut WIB: hari (0=Minggu … 6=Sabtu) + menit sejak tengah malam. */
export function wibDayMinutes(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const ambil = (tipe: string) =>
    parts.find((p) => p.type === tipe)?.value ?? "";

  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    ambil("weekday")
  );
  const minutes = Number(ambil("hour")) * 60 + Number(ambil("minute"));
  return { day, minutes };
}

/** "HH:MM" → menit sejak tengah malam. */
export function toMinutes(clock: string): number {
  const [h, m] = clock.split(":").map(Number);
  return h * 60 + m;
}

/** Menit sejak tengah malam → "HH.MM" (gaya jam Indonesia). */
export function formatClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
}

/**
 * Status kedai saat ini. null = tidak ada jadwal sama sekali
 * (badge tidak perlu ditampilkan).
 */
export function getOpenInfo(
  day: number,
  minutes: number,
  schedule: HoursEntry[]
): OpenInfo | null {
  if (schedule.length === 0) return null;

  const hariIni = schedule.find((s) => s.days.includes(day));
  if (hariIni) {
    const buka = toMinutes(hariIni.open);
    const tutup = toMinutes(hariIni.close);
    if (minutes >= buka && minutes < tutup) {
      return { open: true, refMinutes: tutup, daysAhead: 0 };
    }
    if (minutes < buka) {
      return { open: false, refMinutes: buka, daysAhead: 0 };
    }
  }

  // Sudah lewat jam tutup (atau hari ini libur): cari hari buka berikutnya.
  for (let d = 1; d <= 7; d++) {
    const kandidat = (day + d) % 7;
    const entri = schedule.find((s) => s.days.includes(kandidat));
    if (entri) {
      return { open: false, refMinutes: toMinutes(entri.open), daysAhead: d };
    }
  }
  return null;
}

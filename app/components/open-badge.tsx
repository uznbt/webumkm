"use client";

import { useEffect, useState } from "react";
import { site } from "../data/site";
import { openBadgeCopy } from "../data/content";
import { formatClock, getOpenInfo, wibDayMinutes } from "../lib/open-hours";

/**
 * Badge "Buka sekarang / Tutup" — dihitung dari jam buka di
 * app/data/site.ts memakai zona WIB (waktu kedai, bukan waktu
 * perangkat pengunjung). Kalau jadwal kosong, badge tidak tampil.
 * Muncul setelah halaman terbuka, dan ikut berubah saat jam buka
 * atau jam tutup terlewati.
 */
export default function OpenBadge({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{
    open: boolean;
    detail: string;
  } | null>(null);

  useEffect(() => {
    function hitung() {
      const { day, minutes } = wibDayMinutes(new Date());
      const info = getOpenInfo(day, minutes, site.contact.schedule);
      if (!info) {
        setState(null);
        return;
      }

      const labelHari =
        info.daysAhead === 0
          ? ""
          : ` ${
              info.daysAhead === 1
                ? openBadgeCopy.tomorrow
                : openBadgeCopy.dayNames[(day + info.daysAhead) % 7]
            }`;

      setState({
        open: info.open,
        detail: info.open
          ? `${openBadgeCopy.closesPrefix} ${formatClock(info.refMinutes)}`
          : `${openBadgeCopy.opensPrefix}${labelHari} ${formatClock(
              info.refMinutes
            )}`,
      });
    }

    hitung();
    // Perbarui tiap menit + begitu tab dilihat lagi —
    // badge ikut berubah tepat saat jam buka/tutup lewat.
    const timer = setInterval(hitung, 60_000);
    document.addEventListener("visibilitychange", hitung);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", hitung);
    };
  }, []);

  if (!state) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
        state.open
          ? "border-emerald-600/25 bg-emerald-50 text-emerald-800"
          : "border-ink/15 bg-ink/5 text-ink/65"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          state.open ? "bg-emerald-500 motion-safe:animate-pulse" : "bg-ink/40"
        }`}
      />
      {state.open ? openBadgeCopy.open : openBadgeCopy.closed}
      <span
        className={`font-medium ${
          state.open ? "text-emerald-700/90" : "text-ink/50"
        }`}
      >
        {state.detail}
      </span>
    </span>
  );
}

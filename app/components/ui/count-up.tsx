"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pisahkan teks angka jadi bagian-bagiannya — mis. "8+" jadi target 8
 * dengan akhiran "+", "3 thn" jadi target 3 dengan akhiran " thn",
 * atau "4,8" jadi target 4,8 dengan 1 angka di belakang koma.
 */
function parseStat(value: string) {
  const match = value.match(/[\d.,]+/);
  if (!match) return null;

  const raw = match[0];
  const start = match.index ?? 0;
  const target = Number(raw.replace(/\./g, "").replace(",", "."));

  if (!raw.replace(/[.,]/g, "") || !Number.isFinite(target)) return null;
  // Tahun (mis. "2023") jangan dihitung dari nol — aneh kalau angkanya bergerak.
  if (/^(19|20)\d{2}$/.test(raw)) return null;

  const decimals = raw.includes(",") ? (raw.split(",")[1] ?? "").length : 0;
  return {
    target,
    decimals,
    prefix: value.slice(0, start),
    suffix: value.slice(start + raw.length),
  };
}

/** Tulis angka dengan format Indonesia: 1.200 · 4,8 */
function formatNumber(n: number, decimals: number) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Angka yang "berhitung naik" dari 0 begitu bagian ini masuk layar —
 * sekali saja, biar band statistik terasa hidup.
 *
 * Catatan penting:
 * - Tanpa JavaScript / gagal, angka akhir tetap tampil (animasi cuma bonus).
 * - Otomatis nonaktif untuk pengunjung yang menyalakan "kurangi gerakan".
 * - Yang sudah terlihat begitu halaman dibuka tidak dihitung ulang
 *   (biar tidak ada kedipan angka di awal).
 */
export default function CountUp({
  value,
  duration = 1400,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseStat(value);
    if (!el || !parsed) return;

    // Tanpa IntersectionObserver, atau pengunjung minta gerakan minim
    // → angka akhir saja, tanpa hitung-hitungan.
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Sudah terlihat begitu halaman dibuka → dibiarkan, tidak berkedip ke 0.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    const tulis = (n: number) =>
      setDisplay(`${parsed.prefix}${formatNumber(n, parsed.decimals)}${parsed.suffix}`);

    // Sembunyikan dulu jadi 0 — aman, posisinya masih di luar layar.
    tulis(0);

    let raf = 0;
    const hitung = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        if (t >= 1) {
          setDisplay(value); // tepat seperti aslinya begitu selesai
          return;
        }
        const halus = 1 - Math.pow(1 - t, 3); // mulai cepat, lalu melambat
        tulis(parsed.target * halus);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        hitung();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

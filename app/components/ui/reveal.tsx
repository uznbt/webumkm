"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Munculkan isinya dengan animasi halus (pudar + naik pelan) begitu
 * bagian ini masuk layar — sekali saja, tidak berulang saat digulir
 * naik-turun.
 *
 * Catatan penting:
 * - Kalau JavaScript mati / gagal, konten tetap tampil (animasi cuma bonus).
 * - Otomatis nonaktif untuk pengunjung yang menyalakan "kurangi gerakan".
 */
export default function Reveal({
  children,
  /** Jeda kecil (ms) supaya kartu-kartu munculnya berurutan. */
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Tanpa IntersectionObserver, atau pengunjung minta gerakan minim
    // → tampil apa adanya, tanpa animasi.
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Yang sudah terlihat begitu halaman dibuka dibiarkan tanpa animasi,
    // biar tidak ada kedipan di bagian paling atas.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    // Sembunyikan dulu — aman, karena posisinya masih di luar layar.
    setHidden(true);

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setHidden(false);
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // Jeda hanya saat muncul; saat menyembunyikan (di luar layar) tanpa jeda.
      style={delay && !hidden ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${className} motion-safe:transition-all motion-safe:duration-500 ${
        hidden ? "motion-safe:translate-y-5 motion-safe:opacity-0" : ""
      }`}
    >
      {children}
    </div>
  );
}

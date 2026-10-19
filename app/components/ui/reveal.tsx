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
 * - Bagian yang sudah terlihat saat halaman dibuka tidak dianimasikan
 *   (biar tidak ada kedipan). Untuk konten yang baru muncul SETELAH
 *   halaman terbuka (mis. ulasan dari sheet), pakai always — animasinya
 *   ikut jalan walau posisinya sudah terlihat.
 */
export default function Reveal({
  children,
  /** Jeda kecil (ms) supaya kartu-kartu munculnya berurutan. */
  delay = 0,
  /** Animasi tetap jalan walau sudah terlihat saat dipasang. */
  always = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  always?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Mode always: sembunyikan sejak render pertama supaya tidak ada
  // kedipan (kontennya memang baru muncul setelah halaman terbuka).
  const [hidden, setHidden] = useState(always);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Tanpa IntersectionObserver, atau pengunjung minta gerakan minim
    // → tampil apa adanya, tanpa animasi.
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Kelas animasi memakai varian motion-safe, jadi tanpa animasi
      // konten sudah terlihat. Tidak perlu mengubah state di sini.
      return;
    }

    if (!always) {
      // Yang sudah terlihat begitu halaman dibuka dibiarkan tanpa animasi,
      // biar tidak ada kedipan di bagian paling atas.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) return;

      // Sembunyikan dulu — aman, karena posisinya masih di luar layar.
      setHidden(true);
    }

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
  }, [always]);

  return (
    <div
      ref={ref}
      // Jeda hanya saat muncul; saat menyembunyikan (di luar layar) tanpa jeda.
      style={delay && !hidden ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${className} motion-safe:transition-all motion-safe:duration-300 ${
        hidden ? "motion-safe:translate-y-2 motion-safe:opacity-0" : ""
      }`}
    >
      {children}
    </div>
  );
}

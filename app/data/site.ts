/*
 * ============================================================
 *  DATA SITUS — identitas bisnis, kontak & tautan
 * ============================================================
 * Semua informasi bisnis ada di file ini. Contoh: untuk mengganti
 * nomor WhatsApp, cukup ubah "whatsappNumber" di bawah — otomatis
 * berubah di seluruh halaman (navbar, kontak, footer, tombol chat).
 *
 * CATATAN: baris bertanda  // TODO  masih data contoh —
 * ganti dengan data asli dari pemilik.
 */

export const site = {
  brand: {
    /** Nama usaha — muncul di navbar, footer, dan pesan WhatsApp. */
    name: "Kedai Raos",
    /** Kalimat singkat tentang usaha — dipakai di footer. */
    tagline:
      "Aneka makanan berat, camilan, dan minuman — dimasak harian di Kantin Kabin, Universitas Singaperbangsa Karawang, sejak 2023.",
    /** Logo transparan — tampil di navbar & ikon tab browser. */
    logo: "/logo.webp",
  },

  /**
   * Alamat web resmi — dipakai untuk SEO (sitemap, Open Graph).
   * Sementara menunjuk alamat Vercel; ganti dengan domain asli
   * begitu domainnya sudah dibeli & tersambung.
   */
  url: "https://kedairaos.vercel.app",

  /** Teks yang muncul di tab browser & hasil pencarian Google. */
  meta: {
    title: "Kedai Raos — Masakan Rumahan di Kantin Kabin Unsika Karawang",
    description:
      "Aneka makanan berat dan ringan serta minuman di Kantin Kabin, Universitas Singaperbangsa Karawang Kampus 2. Dimasak harian sejak 2023. Mampir langsung atau hubungi lewat WhatsApp.",
  },

  contact: {
    /** Format internasional, tanpa tanda "+" dan tanpa "0" di depan. */
    whatsappNumber: "6283865211525",
    /** Versi yang ditampilkan di halaman (boleh pakai tanda hubung). */
    whatsappDisplay: "0838-6521-1525",
    email: "info@kedairaos.id", // TODO: ganti dengan email asli
    addressLine1: "Kantin Kabin, Universitas Singaperbangsa Karawang Kampus 2",
    addressLine2: "Lkr. Karawang, Margasari, Karawang Timur, Karawang 41371",
    /** Dipakai untuk data SEO (Google). */
    city: "Karawang",
    region: "Jawa Barat",
    postalCode: "41371",
    /** Baris jam buka — setiap baris ditampilkan terpisah. */
    hours: [
      "Senin–Jumat 07.30–16.00 WIB",
      "Sabtu 07.30–13.00 WIB · Minggu tutup",
    ], // TODO: samakan dengan jam kantin sebenarnya
    /**
     * Jam buka terstruktur — dipakai data SEO (Google).
     * days: 0 = Minggu, 1 = Senin, ... 6 = Sabtu (boleh lebih dari satu).
     * Format jam "HH:MM" waktu WIB.
     */
    schedule: [
      { days: [1, 2, 3, 4, 5], open: "07:30", close: "16:00" },
      { days: [6], open: "07:30", close: "13:00" },
    ], // TODO: samakan dengan jam asli
    /**
     * Lokasi yang ditunjuk pin di peta Google.
     * Pakai "+" sebagai pengganti spasi.
     *
     * Pin = Universitas Singaperbangsa Karawang (UNSIKA) 2 —
     * Kantin Kabin ada di dalam area kampus ini.
     * Koordinat: -6.3026635, 107.3400307
     * (sumber: https://maps.app.goo.gl/GoSby9xH922B6pDj6)
     */
    mapsQuery: "Universitas+Singaperbangsa+Karawang+(UNSIKA)+2",
  },

  socials: {
    instagram: "https://instagram.com/kedairaos2026",
    tiktok: "https://tiktok.com/@kedairaos2026",
  },

  /**
   * Backend rating (Google Apps Script Web App — lihat folder gas/).
   * Diisi URL yang berakhiran "/exec" setelah backend dipasang.
   * Selama kosong, formulir rating disembunyikan dari situs.
   */
  ratingsEndpoint: "",

  /** Menu navigasi — urutan tampil mengikuti urutan daftar ini. */
  nav: [
    { href: "#home", label: "Beranda" },
    { href: "#menu", label: "Menu" },
    { href: "#why-us", label: "Tentang" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Kontak" },
  ],
};

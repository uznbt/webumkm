/*
 * ============================================================
 *  KATA-KATA HALAMAN — seluruh teks yang tampil di situs
 * ============================================================
 * Semua tulisan dikumpulkan di sini agar mudah diubah tanpa
 * menyentuh kode.
 *
 * Aturan penulisan:
 *   - *kata*  → kata di antara bintang diberi warna merah
 *               (hanya berlaku untuk headline hero)
 *   - \n      → pindah baris (hanya pada beberapa teks tertentu)
 *
 * Situs ini adalah situs profil (display) — tidak ada harga atau
 * pemesanan online. Pengunjung diarahkan untuk mampir ke kedai
 * atau bertanya lewat WhatsApp.
 */

/** Tombol & label yang dipakai berulang di banyak tempat. */
export const common = {
  whatsappCta: "Hubungi via WhatsApp",
  skipToContent: "Lewati ke konten utama",
};

export const heroCopy = {
  kicker: "Usaha mikro kuliner · Karawang",
  headline: "Masakan rumahan,\nharga *bersahabat*",
  subheadline:
    "Kedai Raos menyajikan aneka makanan berat, camilan, dan minuman segar — dimasak harian di Kantin Kabin, Universitas Singaperbangsa Karawang, sejak 2023.",
  bullets: ["Dimasak harian", "Bahan segar", "Porsi pas"],
  secondaryCta: "Lihat menu",
  imageAlt: "Nasi goreng dengan telur mata sapi dan lalapan di Kedai Raos",
};

/** Nama ikon yang tersedia: "star", "leaf", "shield", "pin". */
export type FeatureIcon = "star" | "leaf" | "shield" | "pin";

export interface FeatureItem {
  icon: FeatureIcon;
  title: string;
  description: string;
}

export const featuresCopy: {
  kicker: string;
  heading: string;
  paragraph: string;
  linkLabel: string;
  items: FeatureItem[];
} = {
  kicker: "Kenapa Kedai Raos",
  heading: "Sederhana, tapi rasanya tidak main-main",
  paragraph:
    "Berdiri sejak 2023, Kedai Raos dikelola langsung oleh Ibu Titin bersama tim kecilnya di Kantin Kabin. Dapurnya sederhana — tapi setiap piring dimasak seperti di rumah.",
  linkLabel: "Lihat menu kami",
  items: [
    {
      icon: "star",
      title: "Aneka pilihan lengkap",
      description:
        "Makanan berat, camilan, sampai minuman tersedia — tinggal pilih sesuai selera.",
    },
    {
      icon: "leaf",
      title: "Dimasak setiap hari",
      description:
        "Menu dimasak harian di dapur kantin, jadi yang disajikan selalu segar.",
    },
    {
      icon: "shield",
      title: "Bersih & higienis",
      description:
        "Bahan dipilih segar dan diolah di dapur yang selalu bersih.",
    },
    {
      icon: "pin",
      title: "Mudah dijangkau",
      description:
        "Ada di Kantin Kabin kampus Unsika — tinggal mampir saat jam istirahat.",
    },
  ],
};

/** Angka fakta di band merah. */
export const stats = [
  { value: "2023", label: "mulai berjualan" },
  { value: "8+", label: "menu pilihan" },
  { value: "3 thn", label: "menemani kampus" },
  { value: "2", label: "orang di dapur" },
];

export const menuCopy = {
  kicker: "Menu kami",
  heading: "Aneka masakan rumahan",
  note: "Foto hanya sebagian menu — aneka minuman dan menu lain bisa langsung dilihat di kedai.",
  /** Label tombol filter untuk menampilkan semua kategori. */
  allCategories: "Semua",
};

export const faqCopy: {
  kicker: string;
  heading: string;
  items: { question: string; answer: string }[];
} = {
  kicker: "Pertanyaan umum",
  heading: "Sering ditanya",
  items: [
    {
      question: "Di mana lokasi Kedai Raos?",
      answer:
        "Kedai Raos ada di Kantin Kabin, Universitas Singaperbangsa Karawang Kampus 2, Karawang Timur. Tinggal ikuti peta di halaman ini — dari area kampus cukup mampir sebentar.",
    },
    {
      question: "Jam bukanya kapan?",
      answer:
        "Kedai buka mengikuti jam kantin: Senin–Jumat 07.30–16.00 WIB dan Sabtu 07.30–13.00 WIB. Hari Minggu libur.",
    },
    {
      question: "Bisa dibungkus atau pesan dalam jumlah banyak?",
      answer:
        "Semua menu bisa dibungkus untuk dibawa pulang. Untuk pesanan dalam jumlah banyak, hubungi kami lewat WhatsApp dulu supaya bisa kami siapkan.",
    },
    {
      question: "Pembayarannya bagaimana?",
      answer:
        "Pembayaran bisa tunai (cash) atau QRIS — dilakukan langsung di kedai.",
    },
    {
      question: "Menu apa yang paling sering dicari?",
      answer:
        "Nasi goreng dan seblak paling sering jadi pilihan warga kampus. Semuanya dimasak segar setiap hari, jadi datang lebih awal untuk pilihan paling lengkap.",
    },
    {
      question: "Bisa pesan untuk acara kampus?",
      answer:
        "Bisa. Untuk pesanan acara atau jumlah besar, hubungi kami lebih awal lewat WhatsApp agar bisa kami jadwalkan masaknya.",
    },
  ],
};

export const contactCopy = {
  kicker: "Mampir atau chat",
  heading: "Hubungi kami",
  addressLabel: "Alamat kedai",
  hoursLabel: "Jam buka",
  phoneLabel: "WhatsApp / telepon",
  emailLabel: "Email",
  mapTitle: "Peta lokasi Kedai Raos di Kantin Kabin, Karawang",
};

export const footerCopy = {
  linksHeading: "Tautan",
  connectHeading: "Terhubung",
  tagline: "Dibuat dengan sepenuh hati di Karawang.",
  rights: "All rights reserved.",
};

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
}

export const testimonialsCopy: {
  heading: string;
  note: string;
  summaryScore: string;
  summaryText: string;
  /** Dipakai saat ulasan asli sudah tampil: "dari 12 ulasan pelanggan". */
  reviewCountPrefix: string;
  reviewCountSuffix: string;
  /** Ulasan pertama ditampilkan besar (jadi pilih yang paling meyakinkan). */
  items: Testimonial[];
} = {
  heading: "Kata pelanggan kami",
  note: "Cerita dari warga kampus",
  summaryScore: "4,8/5",
  summaryText: "dari pelanggan setia di kantin",
  /** Dipakai saat ulasan asli sudah tampil: "dari 12 ulasan pelanggan". */
  reviewCountPrefix: "dari",
  reviewCountSuffix: "ulasan pelanggan",
  items: [
    {
      name: "Raka Pratama",
      role: "Mahasiswa · pelanggan sejak 2023",
      rating: 5,
      text: "Porsi mahasiswa, rasa masakan rumah. Nasi gorengnya yang paling sering aku pesan — telurnya masih lumer pas disajikan.",
    },
    {
      name: "Sari Wulandari",
      role: "Dosen",
      rating: 5,
      text: "Seblaknya juara, pedasnya bisa minta sesuai selera. Harga tetap ramah kantong.",
    },
    {
      name: "Dimas Anggara",
      role: "Mahasiswa",
      rating: 4,
      text: "Sering sarapan di sini sebelum kelas pagi. Cepat, enak, dan Ibu Titin-nya ramah.",
    },
    {
      name: "Nabila Putri",
      role: "Mahasiswa",
      rating: 5,
      text: "Suka pesan bungkus buat dibawa ke kos. Selalu disiapkan rapi dan masih hangat.",
    },
  ],
};

/* ============================================================
 *  FORMULIR "BERI RATING" (tersambung ke Google Sheet)
 * ============================================================ */

export const ratingCopy = {
  /** Tombol untuk membuka formulir. */
  ctaOpen: "Beri rating",
  ctaClose: "Tutup",
  heading: "Beri ratingmu",
  note: "Sudah pernah makan di Kedai Raos? Bagikan penilaianmu — kami baca semua masukannya.",
  /** Label kelompok bintang untuk pembaca layar. */
  starsGroupLabel: "Pilih jumlah bintang",
  /** Keterangan tiap bintang (1→5). Dipakai sebagai tooltip & teks pendamping. */
  starTitles: ["Sangat kurang", "Kurang", "Cukup enak", "Enak", "Sangat enak"],
  nameLabel: "Nama (boleh kosong)",
  namePlaceholder: "Contoh: Raka",
  commentLabel: "Cerita singkat (boleh kosong)",
  commentPlaceholder: "Contoh: nasi gorengnya mantap, telurnya masih lumer",
  submit: "Kirim rating",
  submitting: "Mengirim…",
  /** Peringatan kalau tombol kirim ditekan tanpa memilih bintang. */
  needRating: "Pilih dulu bintangnya ya.",
  successTitle: "Terima kasih!",
  successBody: "Ratingmu sudah kami terima.",
  errorText: "Gagal mengirim. Coba lagi sebentar lagi ya.",
};

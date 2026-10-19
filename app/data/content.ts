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
      question: "Apa itu poin Kedai Raos?",
      answer:
        "Setiap 1 porsi yang dibeli di kedai bernilai 1 poin. Daftar gratis lewat halaman Poin di situs — cukup nama, nomor WhatsApp, dan sandi; bisa juga dibantu kasir di kedai. Setelah masuk, poin ditukar dengan hadiah berupa kupon digital, jadi tidak perlu kartu kertas dan tidak bisa hilang.",
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

export const testimonialsCopy: {
  heading: string;
  note: string;
  /** Dipakai saat ulasan asli sudah tampil: "dari 12 ulasan pelanggan". */
  reviewCountPrefix: string;
  reviewCountSuffix: string;
  /** Ditampilkan selagi menunggu jawaban dari Google Sheet. */
  loadingText: string;
  /** Ditampilkan saat sheet benar-benar masih kosong (bukan karangan). */
  emptyText: string;
  emptyHint: string;
} = {
  heading: "Kata pelanggan kami",
  note: "Cerita dari warga kampus",
  /** Dipakai saat ulasan asli sudah tampil: "dari 12 ulasan pelanggan". */
  reviewCountPrefix: "dari",
  reviewCountSuffix: "ulasan pelanggan",
  loadingText: "Memuat ulasan…",
  emptyText: "Belum ada ulasan — jadilah yang pertama bercerita!",
  emptyHint: "Ceritamu membantu pengunjung lain memilih menu.",
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

/** Badge status buka/tutup di seksi Kontak. */
export const openBadgeCopy = {
  open: "Buka sekarang",
  closed: "Tutup",
  /** Keterangan setelah status buka: "· tutup 16.00". */
  closesPrefix: "· tutup",
  /** Keterangan setelah status tutup: "· buka besok 07.30". */
  opensPrefix: "· buka",
  tomorrow: "besok",
  /** 0 = Minggu … 6 = Sabtu. */
  dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
};

/** Halaman 404 — alamat salah ketik / tidak ada. */
export const notFoundCopy = {
  kicker: "404",
  heading: "Halaman tidak ditemukan",
  body: "Mungkin alamatnya salah ketik, atau halamannya sudah pindah. Tenang — kamu bisa kembali ke beranda atau langsung lihat menu kami.",
  homeCta: "Kembali ke beranda",
  menuCta: "Lihat menu",
};

/* ============================================================
 *  CHAT AI "TANYA RAOS" (tombol bulat & panel tanya-jawab)
 * ============================================================ */

export const chatCopy = {
  /** Label tombol bulat melayang (untuk pembaca layar). */
  buttonLabel: "Tanya Raos — buka chat",
  /** Label tombol bulat saat panel chat sedang terbuka. */
  buttonLabelOpen: "Tanya Raos — tutup chat",
  title: "Tanya Raos",
  subtitle: "Asisten AI · jawab sekejap",
  /** Sapaan pembuka dari asisten. */
  opening:
    "Halo! Aku asisten Kedai Raos 😊 Mau tanya apa? Aku tahu soal menu, jam buka, lokasi, dan cara pesan.",
  /** Contoh pertanyaan — bisa langsung ditekan. */
  suggestions: [
    "Jam buka kapan?",
    "Ada menu apa saja?",
    "Lokasinya di mana?",
    "Bisa dibungkus?",
    "Poin itu apa?",
  ],
  inputPlaceholder: "Tulis pertanyaanmu…",
  sendLabel: "Kirim",
  closeLabel: "Tutup chat",
  typingLabel: "Sedang menulis…",
  /** Tombol yang muncul saat pengunjung menulis pesanan yang ada di menu. */
  waCta: "Lanjutkan pesan lewat WhatsApp",
  /** Awal pesan otomatis yang terisi di WhatsApp. */
  waPrefill: "Halo Kedai Raos! Saya mau pesan:",
  /** Balasan pengganti saat ada kendala (dipakai sesuai jenis kendalanya). */
  errorText: "Maaf, lagi ada gangguan. Coba lagi sebentar ya 🙏",
  rateText: "Pelan dulu ya — tunggu beberapa detik, lalu coba lagi 😊",
  busyText: "Sekarang lagi ramai yang tanya 😅 Coba lagi beberapa menit ya.",
  offlineText: "Chat AI-nya belum diaktifkan. Coba lagi nanti ya 🙏",
  /** Catatan kecil di bawah kolom tanya. */
  disclaimer:
    "Jawaban dibuat oleh AI dan bisa keliru. Info resmi ada di bagian Kontak.",
  /**
   * Catatan tambahan sebagai "bahan bacaan" si AI — tidak tampil di
   * halaman. Cocok untuk hal-hal yang sering ditanya lewat chat.
   */
  catatanUntukAi: [
    "Resep detail tidak dibagikan (rahasia dapur). Kalau ditanya resep: balas santai sambil bercanda ringan, lalu arahkan pengunjung untuk mencoba langsung di kedai.",
    "Kalau ditanya pemilik atau siapa yang mengelola: jawab ramah bahwa Kedai Raos dikelola langsung oleh Ibu Titin bersama tim kecilnya — jangan mengaku tidak punya info, dan tidak perlu mengalihkan ke WhatsApp.",
    "Kalau ditanya buka/tutup saat ini: pakai baris \"Sekarang (WIB)\" di data, bandingkan dengan jam buka, lalu jawab singkat — jangan sekadar menyalin daftar jam buka.",
    "Kalau ditanya hal yang datanya belum ada (misalnya sertifikasi halal, layanan antar/ojol, atau harga): jujur bilang belum ada infonya, lalu arahkan mampir atau tanya WhatsApp — jangan memastikan sendiri.",
    "Kedai tidak punya layanan antar sendiri dan tidak disebutkan bekerja sama dengan ojek/ojol mana pun. Jangan pernah menjanjikan \"siap antar\" atau \"diantar ke kampus\" — untuk pesanan banyak, arahkan ke WhatsApp dan sebutkan pesanan bisa dibungkus/diambil di kedai.",
    "Jawab langsung ke inti pertanyaan; jangan menambah info yang tidak ditanya.",
    "Kalau pertanyaan pengunjung ambigu atau kurang jelas maksudnya, jangan mengarang: tebak dulu maksud yang paling mungkin, lalu tanya balik singkat.",
    "Kalau pengunjung mau memesan: arahkan lewat WhatsApp kedai (sebutkan nomornya) atau datang langsung; kamu tidak bisa memproses pesanan sendiri.",
    "Kalau menu yang dipesan tidak ada di daftar menu: katakan dengan ramah menu itu tidak tersedia dan sebutkan menu yang ada — jangan mengarang menu baru.",
    "Kalau ditanya poin atau kupon: jelaskan aturan 1 porsi = 1 poin dan cara daftar gratis lewat halaman Poin (nama, nomor WhatsApp, sandi) atau dibantu kasir di kedai. Jangan mengarang saldo poin, daftar hadiah, atau kode kupon milik pengunjung — kamu tidak bisa melihat data itu. Arahkan ke halaman Poin atau ke kasir.",
  ],
};

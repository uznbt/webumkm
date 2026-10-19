/*
 * ============================================================
 *  KARTU RAOS — poin & kupon digital
 * ============================================================
 * Semua teks halaman /poin (anggota) dan /kasir (kasir) ada di
 * sini. Aturan mainnya:
 *   - 1 porsi yang dibeli = 1 poin.
 *   - Anggota daftar gratis di kedai; kasir membuatkan nomor
 *     anggota + PIN 6 angka.
 *   - Poin ditukar jadi kupon digital berkode (tanpa kertas).
 *   - Kasir menandai kupon "terpakai" saat ditukarkan.
 */

export const poinCopy = {
  meta: {
    title: "Poin Raos — Kartu anggota digital Kedai Raos",
    description:
      "Kumpulkan poin tiap porsi di Kedai Raos, lalu tukarkan dengan hadiah. Kartu anggota digital — tidak perlu kertas, tidak bisa hilang.",
  },

  kicker: "Kartu Raos",
  heading: "Poin dari tiap porsi, hadiah tanpa kertas",
  subheading:
    "Setiap porsi yang kamu beli di Kedai Raos bernilai 1 poin. Kumpulkan, lalu tukarkan dengan hadiah — semua tersimpan digital di kartu anggotamu.",

  cara: [
    {
      judul: "1 porsi = 1 poin",
      isi: "Poin masuk otomatis saat kasir mencatat transaksimu. Tidak perlu bawa kartu fisik.",
    },
    {
      judul: "Daftar gratis di kedai",
      isi: "Minta kasir membuatkan nomor anggota dan PIN. Cukup sekali, tanpa unduh aplikasi.",
    },
    {
      judul: "Tukar jadi kupon",
      isi: "Pilih hadiah di halaman ini, dapat kode kupon, lalu tunjukkan ke kasir.",
    },
  ],

  login: {
    judul: "Masuk kartu anggota",
    keterangan:
      "Pakai nomor anggota dan PIN 6 angka yang diberikan kasir saat kamu mendaftar di kedai.",
    nomorLabel: "Nomor anggota",
    nomorPlaceholder: "Contoh: KR-0001",
    pinLabel: "PIN 6 angka",
    pinPlaceholder: "••••••",
    tombol: "Masuk",
    sibuk: "Memeriksa…",
    belumPunya: "Belum punya nomor anggota?",
    belumPunyaIsi:
      "Daftar gratis di kedai — minta kasir membuatkan kartu digitalmu. Tidak perlu unduh aplikasi.",
  },

  kartu: {
    label: "Kartu anggota",
    poinLabel: "poin",
    sejak: "Anggota sejak",
    kuponAktif: "Kupon aktif",
    hadiahTersedia: "Hadiah tersedia",
  },

  tab: {
    tukar: "Tukar poin",
    kupon: "Kupon saya",
    riwayat: "Riwayat",
  },

  tukar: {
    judul: "Tukar poin",
    keterangan: "Pilih hadiah yang tersedia. Kupon berlaku beberapa hari sejak ditukar.",
    tombol: "Tukar",
    kurang: "Poin belum cukup",
    kosong: "Belum ada hadiah yang tersedia. Coba lagi nanti ya.",
    konfirmasi: "Tukar poin untuk hadiah ini?",
    ya: "Ya, tukar",
    batal: "Batal",
  },

  kupon: {
    judul: "Kupon saya",
    kosong: "Belum ada kupon. Tukar poinmu dulu, ya!",
    aktif: "Aktif",
    terpakai: "Sudah dipakai",
    kedaluwarsa: "Kedaluwarsa",
    berlakuSampai: "Berlaku sampai",
    ditukar: "Ditukar",
    tunjukkan: "Tunjukkan kode ini ke kasir saat menukarkan hadiah.",
    salin: "Salin kode",
    tersalin: "Tersalin!",
    baruJudul: "Kupon berhasil dibuat!",
  },

  riwayat: {
    judul: "Riwayat poin",
    kosong: "Belum ada riwayat. Poin pertamamu menunggu di kedai!",
    masuk: "Poin masuk",
    tukar: "Tukar hadiah",
  },

  gantiPin: {
    tombol: "Ganti PIN",
    judul: "Ganti PIN",
    keterangan: "Demi keamanan, masukkan PIN lama sebelum membuat PIN baru.",
    lamaLabel: "PIN lama",
    baruLabel: "PIN baru (6 angka)",
    ulangLabel: "Ulangi PIN baru",
    simpan: "Simpan PIN baru",
    batal: "Batal",
    berhasil: "PIN berhasil diganti. Ingat PIN barumu ya.",
    beda: "PIN baru dan ulangannya belum sama.",
    format: "PIN harus 6 angka.",
  },

  tombol: {
    keluar: "Keluar",
    segarkan: "Segarkan",
    kembali: "Kembali ke beranda",
  },

  memuat: "Memuat kartu anggota…",
  sesiHabis: "Sesi kamu sudah berakhir. Masuk lagi ya.",
  nonaktif:
    "Program poin belum diaktifkan. Hubungi pengelola kedai untuk mengaktifkannya.",
  jaringan: "Tidak bisa terhubung. Periksa internet lalu coba lagi.",
  gangguan: "Lagi ada gangguan. Coba lagi sebentar ya.",
  umum: "Terjadi kesalahan. Coba lagi ya.",
} as const;

export const kasirCopy = {
  metaTitle: "Kasir — Kedai Raos",

  judul: "Kasir Kedai Raos",
  subjudul: "Tambah poin, daftarkan anggota, dan tukar kupon.",
  kembali: "Kembali ke situs",

  login: {
    judul: "Masuk kasir",
    keterangan: "Masukkan PIN kasir untuk membuka halaman ini.",
    pinLabel: "PIN kasir",
    pinPlaceholder: "••••••",
    tombol: "Masuk",
    sibuk: "Memeriksa…",
    salah: "PIN kasir salah.",
  },

  pinBawaan:
    "PIN kasir masih bawaan (123456). Segera ganti di Apps Script → Project Settings → Script Properties → PIN_KASIR.",

  tab: {
    tambah: "Tambah poin",
    daftar: "Daftar anggota",
    kupon: "Tukar kupon",
  },

  keluar: "Keluar",
  sibuk: "Memproses…",

  cari: {
    judul: "Cari anggota",
    keterangan: "Cari pakai nomor anggota, nomor WhatsApp, atau nama.",
    placeholder: "Contoh: KR-0001 / 0838… / Raka",
    tombol: "Cari",
    kosong: "Tidak ada anggota yang cocok. Coba kata kunci lain.",
    pilih: "Pilih anggota di atas untuk menambah poin.",
  },

  tambah: {
    judul: "Tambah poin",
    keterangan: "1 porsi = 1 poin. Masukkan jumlah porsi pada transaksi ini.",
    porsiLabel: "Jumlah porsi",
    catatanLabel: "Catatan (boleh kosong)",
    catatanPlaceholder: "Contoh: nasi goreng + es teh",
    tombol: "Tambahkan poin",
    berhasil: "Poin berhasil ditambahkan.",
    saldo: "Saldo sekarang",
  },

  daftar: {
    judul: "Daftarkan anggota baru",
    keterangan:
      "Isi nama anggota. Nomor anggota dan PIN dibuat otomatis — berikan PIN-nya ke anggota.",
    namaLabel: "Nama anggota",
    namaPlaceholder: "Contoh: Raka Pratama",
    waLabel: "Nomor WhatsApp (boleh kosong)",
    waPlaceholder: "Contoh: 0838…",
    tombol: "Buat kartu anggota",
    berhasil: "Kartu anggota berhasil dibuat.",
    nomorLabel: "Nomor anggota",
    pinLabel: "PIN awal",
    pinCatatan:
      "Catat / berikan PIN ini ke anggota. PIN bisa diganti sendiri lewat halaman Poin.",
    salin: "Salin",
    tersalin: "Tersalin!",
    lagi: "Daftarkan anggota lain",
  },

  kupon: {
    judul: "Tukar kupon",
    keterangan: "Masukkan kode kupon dari anggota, lalu tekan Periksa.",
    kodeLabel: "Kode kupon",
    kodePlaceholder: "Contoh: RAOS-7F3K9",
    tombol: "Periksa & pakai",
    berhasil: "Kupon valid — hadiah sudah bisa diserahkan.",
    anggota: "Anggota",
    hadiah: "Hadiah",
    poin: "Poin terpakai",
    kosong: "Masukkan kode kupon dulu.",
  },

  reset: {
    judul: "Reset PIN anggota",
    keterangan:
      "Kalau anggota lupa PIN, buat PIN baru di sini. PIN lama langsung tidak berlaku.",
    tombol: "Buat PIN baru",
    berhasil: "PIN baru berhasil dibuat.",
    pinBaru: "PIN baru",
  },

  jaringan: "Tidak bisa terhubung. Periksa internet lalu coba lagi.",
  sesiHabis: "Sesi kasir sudah berakhir. Masuk lagi ya.",
  gangguan: "Lagi ada gangguan. Coba lagi sebentar ya.",
  umum: "Terjadi kesalahan. Coba lagi ya.",
  nonaktif:
    "Program poin belum diaktifkan. Pastikan backend Apps Script sudah dipasang.",
} as const;

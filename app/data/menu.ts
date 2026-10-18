/*
 * ============================================================
 *  DATA MENU — satu-satunya tempat untuk mengelola daftar menu
 * ============================================================
 *
 * Cara menambah menu baru:
 *   1. Simpan foto ke folder  public/menu/  (format .webp,
 *      latar transparan disarankan — nama file tanpa spasi)
 *   2. Salin salah satu blok di bawah, tempel di akhir daftar,
 *      lalu ubah isinya
 *   3. Simpan file — kartu menu baru otomatis muncul di halaman
 *
 * Urutan tampil mengikuti urutan daftar di bawah ini.
 *
 * Catatan: halaman ini hanya MENAMPILKAN menu (tanpa harga) —
 * pembelian dilakukan langsung di kedai.
 *
 * Catatan kolom:
 *   - category : mengelompokkan menu. Filter di halaman muncul
 *                otomatis dari kategori yang ada.
 */

export interface MenuItem {
  /** Nama menu yang tampil di kartu. Harus unik antar menu. */
  name: string;
  /** Deskripsi singkat, cukup 1 kalimat. */
  description: string;
  /** Path foto, relatif dari folder public. Contoh: "/menu/seblak.webp" */
  image: string;
  /** Kategori menu. Contoh: "Aneka Nasi", "Mie & Seblak". */
  category: string;
}

export const menuItems: MenuItem[] = [
  {
    name: "Nasi Goreng",
    description: "Nasi goreng kampung dengan telur mata sapi dan lalapan segar.",
    image: "/menu/nasi-goreng.webp",
    category: "Aneka Nasi",
  },
  {
    name: "Nasi Ayam Goreng",
    description: "Ayam goreng gurih dengan nasi hangat dan lalapan.",
    image: "/menu/nasi-ayam-goreng.webp",
    category: "Aneka Nasi",
  },
  {
    name: "Nasi Ayam Suwir",
    description: "Ayam suwir berbumbu dengan nasi hangat.",
    image: "/menu/nasi-ayam-suwir.webp",
    category: "Aneka Nasi",
  },
  {
    name: "Nasi Tongkol Suwir",
    description: "Tongkol suwir berbumbu pedas, teman makan siang.",
    image: "/menu/nasi-tongkol-suwir.webp",
    category: "Aneka Nasi",
  },
  {
    name: "Nasi Daun Jeruk",
    description: "Nasi gurih beraroma daun jeruk dengan lauk pilihan.",
    image: "/menu/nasi-daun-jeruk.webp",
    category: "Aneka Nasi",
  },
  {
    name: "Nasi Bakar",
    description: "Nasi berbumbu dibungkus daun pisang lalu dibakar hingga harum.",
    image: "/menu/nasi-bakar.webp",
    category: "Aneka Nasi",
  },
  {
    name: "Mie Goreng",
    description: "Mie goreng telur dengan sayuran segar.",
    image: "/menu/mie-goreng.webp",
    category: "Mie & Seblak",
  },
  {
    name: "Seblak",
    description: "Seblak kuah pedas dengan kerupuk, telur, dan sosis.",
    image: "/menu/seblak.webp",
    category: "Mie & Seblak",
  },
];

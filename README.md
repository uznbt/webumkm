# Kedai Raos — Situs & Kartu Raos

Situs profil dan pemesanan **Kedai Raos** (Kantin Kabin 2, Universitas Singaperbangsa Karawang).
Dibuat dengan Next.js 16 + Tailwind CSS v4, terhubung ke Google Sheets lewat Google Apps Script.

Alamat produksi: <https://kedairaos.vercel.app>

## Isi situs

| Bagian | Alamat | Keterangan |
| --- | --- | --- |
| Beranda | `/` | Profil, menu, FAQ, ulasan asli, kontak, chat AI "Tanya Raos" |
| Kartu Raos | `/poin` | Anggota: daftar, masuk, lihat poin, tukar hadiah jadi kupon |
| Kasir | `/kasir` | Khusus pengelola: catat poin, daftarkan anggota, tukar kupon (pakai PIN) |

## Menjalankan di laptop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # cek produksi
npm start       # jalankan hasil build
npm run lint    # cek gaya kode
```

## Di mana mengubah isi situs

- **Semua teks dan data bisnis ada di `app/data/`** — nama, menu, FAQ, teks halaman poin, dsb.
  Tidak perlu menyentuh komponen untuk mengganti kalimat atau menambah menu.
- Foto menu disimpan di `public/menu/` (format `.webp`, nama file tanpa spasi).
- Logika koneksi ke server ada di `app/lib/` (`ratings.ts`, `chat.ts`, `poin.ts`).

## Backend (Google Apps Script)

Folder `gas/` berisi backend Apps Script, **sengaja tidak diunggah ke GitHub** karena memuat
kunci rahasia (AI Groq & Pusher). Panduan pasang dan deploy ada di `gas/CARA-PASANG.md`
(ada di laptop, bukan di repo).

Fitur backend: ulasan + vote, chat AI (tabel "Tanya Jawab" lalu Groq), Kartu Raos
(Anggota, Poin, Kupon, Hadiah), dan halaman kasir.

## Gambar di produksi

- Di laptop, gambar dibaca dari folder `public/` seperti biasa.
- Di Vercel, `NEXT_PUBLIC_ASSET_BASE` di `.env.production` mengarahkan gambar ke repo GitHub
  (`raw.githubusercontent.com`) supaya file mentah tidak ikut ter-bundle.

## Deploy

Push ke branch `main` → Vercel otomatis build dan menayangkan versi terbaru.
Perubahan backend Apps Script harus di-deploy manual (Deploy → Manage deployments →
Edit → **New version**).

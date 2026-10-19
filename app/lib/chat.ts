import { site } from "../data/site";
import { menuItems } from "../data/menu";
import { chatCopy, faqCopy } from "../data/content";

/** Satu giliran percakapan dengan asisten (format yang diterima server). */
export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** Batas panjang satu pertanyaan (huruf). */
export const CHAT_MAX_INPUT = 500;

/** Jumlah pesan terakhir yang ikut dikirim ke server. */
const KIRIM_MAKS = 6;

/** Hasil satu percobaan kirim chat. */
export type HasilChat =
  | { jenis: "balasan"; teks: string }
  | { jenis: "pelan" | "ramai" | "nonaktif" | "gangguan" };

/** Fitur chat ikut aktif kalau backend sudah dipasang. */
export function chatEnabled() {
  return Boolean(site.ratingsEndpoint);
}

let cacheKonteks = "";

/**
 * Ringkasan data kedai — "bahan bacaan" si AI supaya jawabannya
 * akurat dan tidak mengarang. Disusun otomatis dari file data,
 * jadi begitu menu/jam diubah, bahan bacaan ikut berubah.
 */
export function chatKonteks(): string {
  if (cacheKonteks) return cacheKonteks;

  const c = site.contact;
  const baris: string[] = [];

  baris.push(`Nama usaha: ${site.brand.name}`);
  baris.push(site.brand.tagline);
  baris.push(`Alamat: ${c.addressLine1}, ${c.addressLine2}`);
  baris.push(`Jam buka: ${c.hours.join(" · ")}`);
  baris.push(`Kontak: WhatsApp ${c.whatsappDisplay}; email ${c.email}`);
  baris.push(
    "Pembayaran: tunai atau QRIS, dilakukan langsung di kedai. Semua menu bisa dibungkus."
  );
  baris.push(
    "Pesanan jumlah banyak / acara: hubungi WhatsApp lebih dulu supaya bisa dijadwalkan."
  );
  baris.push(
    "Catatan penting: situs ini tidak menampilkan harga — harga ditanyakan langsung di kedai."
  );

  const perKategori = new Map<string, string[]>();
  for (const m of menuItems) {
    const daftar = perKategori.get(m.category) || [];
    daftar.push(`${m.name} — ${m.description}`);
    perKategori.set(m.category, daftar);
  }
  baris.push("Menu:");
  for (const [kategori, daftar] of perKategori) {
    baris.push(`- ${kategori}: ${daftar.join("; ")}`);
  }

  baris.push("Tanya-jawab yang sering muncul:");
  for (const { question, answer } of faqCopy.items) {
    baris.push(`- T: ${question}`);
    baris.push(`  J: ${answer}`);
  }

  baris.push("Catatan untukmu (asisten):");
  for (const catatan of chatCopy.catatanUntukAi) {
    baris.push(`- ${catatan}`);
  }

  cacheKonteks = baris.join("\n");
  return cacheKonteks;
}

const DEVICE_KEY = "kedai-raos-device";

/** ID acak per perangkat — dipakai server untuk membatasi banjir pesan. */
function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/** Kirim percakapan ke backend (Google Apps Script) & terima balasan. */
export async function kirimChat(riwayat: ChatTurn[]): Promise<HasilChat> {
  try {
    const res = await fetch(site.ratingsEndpoint, {
      method: "POST",
      // text/plain sengaja dipakai supaya tidak kena preflight CORS
      // (Apps Script tidak mendukung preflight).
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "chat",
        device: deviceId(),
        konteks: chatKonteks(),
        messages: riwayat.slice(-KIRIM_MAKS),
      }),
    });

    if (!res.ok) return { jenis: "gangguan" };

    const data = await res.json().catch(() => null);
    if (data && data.ok === true && typeof data.reply === "string") {
      return { jenis: "balasan", teks: data.reply };
    }

    const kode = String((data && data.error) || "");
    if (kode === "pelan") return { jenis: "pelan" };
    if (kode === "ramai") return { jenis: "ramai" };
    // "chat_belum_diatur" = backend baru, tapi kunci AI belum diisi.
    // "rating tidak valid" = backend LAMA (belum punya fitur chat) yang
    // membalas error rating untuk kiriman ber-action "chat".
    if (kode === "chat_belum_diatur" || kode === "rating tidak valid") {
      return { jenis: "nonaktif" };
    }
    return { jenis: "gangguan" };
  } catch {
    return { jenis: "gangguan" };
  }
}

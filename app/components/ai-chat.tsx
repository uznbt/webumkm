"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "./icons";
import { chatCopy } from "../data/content";
import { CHAT_MAX_INPUT, chatEnabled, kirimChat, type ChatTurn } from "../lib/chat";

interface Baris {
  dari: "pengunjung" | "asisten";
  teks: string;
}

/** Ubah jenis kendala dari server menjadi kalimat untuk pengunjung. */
function pesanKendala(jenis: "pelan" | "ramai" | "nonaktif" | "gangguan") {
  if (jenis === "pelan") return chatCopy.rateText;
  if (jenis === "ramai") return chatCopy.busyText;
  if (jenis === "nonaktif") return chatCopy.offlineText;
  return chatCopy.errorText;
}

/** Hormati preferensi "kurangi gerakan" — animasi mesin tik dimatikan. */
function kurangiGerak() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const KETIK_TICK_MS = 24; // jeda antar "ketikan"
const KETIK_TIK_TOTAL = 110; // target jumlah tik (± 2,6 dtk) apa pun panjangnya

/**
 * Mesin tik mini untuk gelembung asisten: teks muncul huruf demi huruf.
 * Setelah selesai, teks penuh diserahkan lewat onSelesai. Kalau
 * pengunjung memilih "kurangi gerakan", teks langsung tampil utuh.
 */
function useMesinTik(onSelesai: (penuh: string) => void) {
  const [teks, setTeks] = useState<string | null>(null);
  const kerja = useRef<{ penuh: string; pos: number } | null>(null);
  const tik = useRef<number | null>(null);

  /** Hentikan animasi; dengan tuntaskan=true teks penuh dikembalikan. */
  function hentikan(tuntaskan: boolean): string | null {
    if (tik.current !== null) {
      window.clearInterval(tik.current);
      tik.current = null;
    }
    const k = kerja.current;
    kerja.current = null;
    setTeks(null);
    if (k && tuntaskan) {
      onSelesai(k.penuh);
      return k.penuh;
    }
    return null;
  }

  function mulai(penuh: string) {
    hentikan(false);
    if (!penuh || kurangiGerak()) {
      onSelesai(penuh);
      return;
    }
    kerja.current = { penuh, pos: 0 };
    setTeks("");
    const langkah = Math.max(1, Math.ceil(penuh.length / KETIK_TIK_TOTAL));
    tik.current = window.setInterval(() => {
      const k = kerja.current;
      if (!k) return;
      k.pos = Math.min(k.penuh.length, k.pos + langkah);
      if (k.pos >= k.penuh.length) hentikan(true);
      else setTeks(k.penuh.slice(0, k.pos));
    }, KETIK_TICK_MS);
  }

  // Bersihkan timer saat komponen dilepas.
  useEffect(() => {
    return () => {
      if (tik.current !== null) window.clearInterval(tik.current);
    };
  }, []);

  return { teks, mulai, selesaiSekarang: () => hentikan(true) };
}

function Gelembung({
  dari,
  teks,
  menulis,
  senyap,
}: {
  dari: "pengunjung" | "asisten";
  teks?: string;
  menulis?: boolean;
  /** Jangan dibacakan pembaca layar (teks masih dianimasikan). */
  senyap?: boolean;
}) {
  const kanan = dari === "pengunjung";
  return (
    <div
      aria-hidden={senyap || undefined}
      className={`max-w-[85%] ${kanan ? "self-end" : "self-start"}`}
    >
      <div
        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          kanan
            ? "rounded-br-md bg-sambal-600 text-paper"
            : "rounded-bl-md border border-ink/10 bg-white text-ink/90"
        }`}
      >
        {menulis ? (
          <span className="flex items-center gap-1 py-1" aria-label={chatCopy.typingLabel}>
            <span className="h-1.5 w-1.5 rounded-full bg-ink/40 motion-safe:animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/40 motion-safe:animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/40 motion-safe:animate-bounce [animation-delay:240ms]" />
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{teks}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Tombol bulat "Tanya Raos" — pengunjung bisa tanya-jawab dengan
 * asisten AI yang sudah dibekali data kedai (menu, jam, lokasi, FAQ).
 */
export default function AiChat() {
  const [terlihat, setTerlihat] = useState(false);
  const [buka, setBuka] = useState(false);
  const [draf, setDraf] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [percakapan, setPercakapan] = useState<Baris[]>([]);
  const daftarRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sapaan pembuka: ikut "diketik" sekali saat panel pertama dibuka.
  const [pembukaAkhir, setPembukaAkhir] = useState("");
  const pembukaSudahJalan = useRef(false);
  const mesinPembuka = useMesinTik(setPembukaAkhir);

  // Balasan asisten: diketik huruf demi huruf; teks utuh dimasukkan
  // ke percakapan begitu animasinya selesai.
  const mesinBalasan = useMesinTik((penuh) =>
    setPercakapan((lama) => [...lama, { dari: "asisten", teks: penuh }])
  );

  // Muncul setelah pengunjung melewati hero (sama seperti tombol lama).
  useEffect(() => {
    const onScroll = () => setTerlihat(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Selalu tampilkan percakapan terbaru.
  useEffect(() => {
    const kotak = daftarRef.current;
    if (kotak) kotak.scrollTop = kotak.scrollHeight;
  }, [percakapan, mengirim, buka, mesinBalasan.teks, mesinPembuka.teks]);

  // Langsung bisa mengetik begitu panel dibuka.
  useEffect(() => {
    if (buka) inputRef.current?.focus();
  }, [buka]);

  // Mulai animasi sapaan saat panel pertama kali dibuka.
  useEffect(() => {
    if (buka && !pembukaSudahJalan.current) {
      pembukaSudahJalan.current = true;
      mesinPembuka.mulai(chatCopy.opening);
    }
    // Cukup dijalankan sekali per pembukaan — mesinPembuka tidak
    // dimasukkan daftar ketergantungan dengan sengaja.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buka]);

  if (!chatEnabled()) return null;

  const pembukaTampil = mesinPembuka.teks ?? pembukaAkhir;

  async function kirim(teks?: string) {
    const isi = (teks ?? draf).trim().slice(0, CHAT_MAX_INPUT);
    if (!isi || mengirim) return;

    setDraf("");

    // Kalau balasan sebelumnya masih dianimasikan, tuntaskan dulu
    // supaya urutan percakapan tetap utuh.
    const tertunda = mesinBalasan.selesaiSekarang();
    const dasar: Baris[] = tertunda
      ? [...percakapan, { dari: "asisten", teks: tertunda }]
      : percakapan;

    const riwayat: Baris[] = [...dasar, { dari: "pengunjung", teks: isi }];
    setPercakapan(riwayat);
    setMengirim(true);

    const hasil = await kirimChat(
      riwayat.map<ChatTurn>((b) => ({
        role: b.dari === "pengunjung" ? "user" : "assistant",
        content: b.teks,
      }))
    );

    setMengirim(false);
    mesinBalasan.mulai(
      hasil.jenis === "balasan" ? hasil.teks : pesanKendala(hasil.jenis)
    );
  }

  return (
    <>
      {buka && (
        <section
          role="dialog"
          aria-label={chatCopy.title}
          onKeyDown={(e) => {
            if (e.key === "Escape") setBuka(false);
          }}
          className="fixed right-4 bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink/15 bg-paper shadow-2xl"
        >
          <header className="flex items-center gap-3 bg-sambal-700 px-4 py-3 text-paper">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper/15">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-lg leading-tight">
                {chatCopy.title}
              </span>
              <span className="block truncate text-xs text-paper/75">
                {chatCopy.subtitle}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setBuka(false)}
              aria-label={chatCopy.closeLabel}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-150 hover:bg-paper/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div
            ref={daftarRef}
            aria-live="polite"
            className="flex max-h-[52vh] min-h-56 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            <Gelembung
              dari="asisten"
              teks={pembukaTampil || undefined}
              menulis={pembukaTampil === ""}
              senyap={mesinPembuka.teks !== null}
            />

            {percakapan.map((b, i) => (
              <Gelembung key={i} dari={b.dari} teks={b.teks} />
            ))}

            {mesinBalasan.teks !== null && (
              <Gelembung
                dari="asisten"
                teks={mesinBalasan.teks || undefined}
                menulis={mesinBalasan.teks === ""}
                senyap
              />
            )}

            {percakapan.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {chatCopy.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => kirim(s)}
                    className="cursor-pointer rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs text-ink/80 transition-colors duration-150 hover:border-sambal-600 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {mengirim && <Gelembung dari="asisten" menulis />}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              kirim();
            }}
            className="border-t border-ink/10 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <label htmlFor="chat-tanya" className="sr-only">
                {chatCopy.inputPlaceholder}
              </label>
              <input
                id="chat-tanya"
                ref={inputRef}
                type="text"
                value={draf}
                onChange={(e) => setDraf(e.target.value)}
                maxLength={CHAT_MAX_INPUT}
                autoComplete="off"
                placeholder={chatCopy.inputPlaceholder}
                className="h-11 min-w-0 flex-1 rounded-full border border-ink/15 bg-paper px-4 text-sm text-ink placeholder:text-ink/45 focus:border-sambal-600 focus:outline-none"
              />
              <button
                type="submit"
                aria-label={chatCopy.sendLabel}
                disabled={!draf.trim() || mengirim}
                className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-sambal-600 text-paper transition-colors duration-150 hover:bg-sambal-700 active:bg-sambal-800 disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-ink/50">
              {chatCopy.disclaimer}
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setBuka((v) => !v)}
        aria-label={buka ? chatCopy.buttonLabelOpen : chatCopy.buttonLabel}
        aria-expanded={buka}
        className={`fixed right-5 bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] z-50 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-sambal-600 text-paper shadow-lg transition-opacity duration-200 hover:bg-sambal-700 active:bg-sambal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 motion-reduce:transition-none ${
          buka || terlihat ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {buka ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </>
  );
}

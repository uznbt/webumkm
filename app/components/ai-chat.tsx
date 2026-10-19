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

function Gelembung({
  dari,
  teks,
  menulis,
}: {
  dari: "pengunjung" | "asisten";
  teks?: string;
  menulis?: boolean;
}) {
  const kanan = dari === "pengunjung";
  return (
    <div className={`max-w-[85%] ${kanan ? "self-end" : "self-start"}`}>
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
  }, [percakapan, mengirim, buka]);

  // Langsung bisa mengetik begitu panel dibuka.
  useEffect(() => {
    if (buka) inputRef.current?.focus();
  }, [buka]);

  if (!chatEnabled()) return null;

  async function kirim(teks?: string) {
    const isi = (teks ?? draf).trim().slice(0, CHAT_MAX_INPUT);
    if (!isi || mengirim) return;

    setDraf("");
    const riwayat: Baris[] = [...percakapan, { dari: "pengunjung", teks: isi }];
    setPercakapan(riwayat);
    setMengirim(true);

    const hasil = await kirimChat(
      riwayat.map<ChatTurn>((b) => ({
        role: b.dari === "pengunjung" ? "user" : "assistant",
        content: b.teks,
      }))
    );

    setPercakapan((lama) => [
      ...lama,
      {
        dari: "asisten",
        teks: hasil.jenis === "balasan" ? hasil.teks : pesanKendala(hasil.jenis),
      },
    ]);
    setMengirim(false);
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
            <Gelembung dari="asisten" teks={chatCopy.opening} />

            {percakapan.map((b, i) => (
              <Gelembung key={i} dari={b.dari} teks={b.teks} />
            ))}

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

"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { ratingCopy, testimonialsCopy } from "../data/content";
import {
  fetchRatings,
  formatRatingDate,
  RATING_REFRESH_MS,
  ratingsEnabled,
  readVotes,
  realtimeEnabled,
  saveVote,
  submitVote,
  subscribeToRatingUpdates,
  type Rating,
} from "../lib/ratings";
import RatingForm from "./rating-form";
import Reveal from "./ui/reveal";

function Stars({
  rating,
  className = "text-gold-400",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div
      className={`flex ${className}`}
      role="img"
      aria-label={`Rating ${rating} dari 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-4 w-4"
          fill={i <= rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/** Bentuk seragam untuk draf maupun ulasan asli. */
interface ReviewView {
  /** Ulasan asli punya id + jumlah vote (draf tidak). */
  id?: string;
  name: string;
  meta: string;
  rating: number;
  text: string;
  up: number;
  down: number;
}

/**
 * Tombol 👍/👎 untuk ulasan asli.
 * Satu perangkat = satu vote per ulasan (diingat di browser);
 * pengunjung boleh pindah 👍 ↔ 👎, dan klik tombol yang sama lagi
 * untuk membatalkan vote-nya (un-like).
 */
function Votes({ r }: { r: ReviewView }) {
  const [voted, setVoted] = useState<"" | "up" | "down">("");
  const [up, setUp] = useState(r.up);
  const [down, setDown] = useState(r.down);
  const [busy, setBusy] = useState(false);

  // Ikuti angka terbaru dari server (ikut berubah saat penyegaran real-time).
  useEffect(() => {
    setUp(r.up);
    setDown(r.down);
  }, [r.up, r.down]);

  // Ingat pilihan pengunjung di perangkat ini (dari kunjungan sebelumnya).
  useEffect(() => {
    if (r.id) setVoted(readVotes()[r.id] ?? "");
  }, [r.id]);

  if (!r.id) return null;

  async function vote(dir: "up" | "down") {
    if (!r.id || busy) return;
    const prev = voted;
    // Klik tombol yang sama lagi = batalkan (un-like); tombol lain = pindah.
    const next: "" | "up" | "down" = prev === dir ? "" : dir;

    // Ubah tampilan dulu biar terasa instan. Kalau gagal terkirim,
    // penyegaran berikutnya mengembalikan angka yang sebenarnya.
    setBusy(true);
    setVoted(next);
    setUp((n) => Math.max(0, n + (next === "up" ? 1 : 0) - (prev === "up" ? 1 : 0)));
    setDown((n) => Math.max(0, n + (next === "down" ? 1 : 0) - (prev === "down" ? 1 : 0)));

    try {
      await submitVote({ id: r.id, dir: next || "none", prev: prev || undefined });
      saveVote(r.id, next);
    } catch {
      /* biarkan — angka asli kembali saat penyegaran berikutnya */
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition-colors duration-150 disabled:opacity-60";

  // Rapat sejajar bintang / info penulis — tidak menambah baris baru.
  return (
    <div className="flex items-center gap-2 text-xs">
      <button
        type="button"
        onClick={() => vote("up")}
        disabled={busy}
        aria-pressed={voted === "up"}
        aria-label={voted === "up" ? "Batalkan" : "Membantu"}
        title={voted === "up" ? "Batalkan" : "Membantu"}
        className={`${btn} ${
          voted === "up" ? "text-gold-300" : "text-paper/55 hover:text-paper"
        }`}
      >
        <ThumbsUp
          className="h-3.5 w-3.5"
          fill={voted === "up" ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span className="tabular-nums">{up}</span>
      </button>
      <button
        type="button"
        onClick={() => vote("down")}
        disabled={busy}
        aria-pressed={voted === "down"}
        aria-label={voted === "down" ? "Batalkan" : "Kurang membantu"}
        title={voted === "down" ? "Batalkan" : "Kurang membantu"}
        className={`${btn} ${
          voted === "down" ? "text-sambal-300" : "text-paper/55 hover:text-paper"
        }`}
      >
        <ThumbsDown
          className="h-3.5 w-3.5"
          fill={voted === "down" ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span className="tabular-nums">{down}</span>
      </button>
    </div>
  );
}

export default function TestimonialsSection() {
  /** undefined = masih memuat dari sheet; [] = sudah dimuat tapi masih kosong. */
  const [reviews, setReviews] = useState<Rating[] | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);

  // Ambil ulasan asli kalau backend sudah dipasang, lalu segarkan berkala
  // supaya ulasan yang baru disetujui muncul sendiri (praktis real-time)
  // ke semua pengunjung yang sedang membuka situs.
  useEffect(() => {
    if (!ratingsEnabled()) return;
    let alive = true;
    let lastJson = "";

    async function refresh() {
      try {
        const items = await fetchRatings();
        if (!alive) return;
        const json = JSON.stringify(items);
        if (json === lastJson) return; // tidak ada perubahan → jangan render ulang
        lastJson = json;
        setReviews(items); // bisa [] kalau sheet masih kosong
      } catch {
        /* gagal ambil = biarkan yang sedang tampil (jangan ganggu pengunjung) */
      }
    }

    refresh();

    const timer = setInterval(() => {
      // Hemat kuota: jangan menyegarkan saat tab tidak dilihat.
      if (document.visibilityState === "visible") refresh();
    }, RATING_REFRESH_MS);

    // Balik ke tab = langsung segarkan, jangan tunggu timer.
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Real-time: begitu backend mengirim sinyal perubahan (Pusher),
    // langsung segarkan — pengunjung dapat ulasan baru dalam sekejap.
    // Penyegaran berkala di atas tetap jalan sebagai cadangan.
    let unsubscribe: (() => void) | null = null;
    if (realtimeEnabled()) {
      subscribeToRatingUpdates(refresh)
        .then((unsub) => {
          if (alive) unsubscribe = unsub;
          else unsub();
        })
        .catch(() => {
          /* real-time gagal tersambung = cukup andalkan penyegaran berkala */
        });
    }

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const real = reviews && reviews.length > 0 ? reviews : null;

  let views: ReviewView[] = [];
  // Angka ringkasan hanya diisi kalau ada ulasan asli — jangan mengarang.
  let summaryScore = "";
  let summaryText = "";
  let summaryStars = 5;

  if (real) {
    // Urutan tampil: paling banyak 👍 di atas; jumlah sama = terbaru dulu.
    const sorted = [...real].sort((a, b) => (b.up ?? 0) - (a.up ?? 0));

    // Yang punya cerita diutamakan jadi kutipan besar.
    const withText = sorted.filter((r) => r.comment.trim() !== "");
    const featured = withText[0] ?? sorted[0];
    const others = sorted.filter((r) => r !== featured);

    views = [featured, ...others].map((r) => ({
      id: r.id,
      name: r.name,
      meta: formatRatingDate(r.date ?? ""),
      rating: r.rating,
      text: r.comment,
      up: r.up ?? 0,
      down: r.down ?? 0,
    }));

    const avg = real.reduce((sum, r) => sum + r.rating, 0) / real.length;
    summaryScore = `${avg.toFixed(1).replace(".", ",")}/5`;
    summaryText = `${testimonialsCopy.reviewCountPrefix} ${real.length} ${testimonialsCopy.reviewCountSuffix}`;
    summaryStars = Math.min(5, Math.max(1, Math.round(avg)));
  }
  // Tanpa ulasan asli: tidak menampilkan apa pun yang dikarang —
  // cukup "memuat" selagi menunggu, lalu ajakan jadi yang pertama.

  // Kutipan besar + maksimal 7 kartu + sel angka = grid tetap lega.
  const [featured, ...others] = views;
  const rest = others.slice(0, 7);

  return (
    <section className="bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl leading-tight text-paper md:text-5xl">
            {testimonialsCopy.heading}
          </h2>
          <p className="font-display text-sm uppercase tracking-[0.22em] text-gold-400">
            {testimonialsCopy.note}
          </p>
        </Reveal>

        {reviews === undefined && ratingsEnabled() ? (
          /* Selagi menunggu jawaban sheet: netral, bukan karangan. */
          <div className="rounded-lg border border-paper/10 bg-sambal-950 px-6 py-10 text-center md:py-12">
            <p className="text-sm text-paper/60 motion-safe:animate-pulse">
              {testimonialsCopy.loadingText}
            </p>
          </div>
        ) : featured ? (
          <div className="grid gap-5 md:grid-cols-3">
            {/* Kutipan utama — sel dominan */}
            <Reveal always className="h-full md:col-span-2">
              <blockquote className="h-full rounded-lg border border-paper/15 bg-sambal-950 p-8">
                <p className="font-display text-2xl leading-snug text-paper md:text-3xl">
                  {featured.text ? (
                    <>&ldquo;{featured.text}&rdquo;</>
                  ) : (
                    featured.name
                  )}
                </p>
                <footer className="mt-6 flex items-center justify-between gap-4">
                  <span>
                    <span className="block font-bold text-paper">
                      {featured.name}
                    </span>
                    <span className="block text-sm text-paper/70">
                      {featured.meta}
                    </span>
                  </span>
                  <div className="flex items-center gap-4">
                    <Votes r={featured} />
                    <Stars rating={featured.rating} />
                  </div>
                </footer>
              </blockquote>
            </Reveal>

            {rest.map((t, i) => (
              <Reveal
                key={t.id ?? i}
                always
                className="h-full"
                delay={Math.min((i + 1) * 50, 200)}
              >
                <blockquote className="h-full rounded-lg border border-paper/15 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Stars rating={t.rating} />
                    <Votes r={t} />
                  </div>
                  {t.text && (
                    <p className="mt-3 text-sm leading-relaxed text-paper/85">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  )}
                  <p className="mt-4">
                    <span className="block text-sm font-bold text-paper">
                      {t.name}
                    </span>
                    <span className="block text-xs text-paper/70">{t.meta}</span>
                  </p>
                </blockquote>
              </Reveal>
            ))}

            {/* Sel angka — penutup baris (break rhythm) */}
            <Reveal always className="h-full" delay={120}>
              <div className="flex h-full flex-col justify-between rounded-lg bg-gold-600 p-6 text-ink">
                <Stars rating={summaryStars} className="text-ink" />
                <div>
                  <p className="font-display text-4xl">{summaryScore}</p>
                  <p className="mt-1 text-sm font-medium">{summaryText}</p>
                </div>
              </div>
            </Reveal>
          </div>
        ) : (
          /* Sheet benar-benar masih kosong: ajakan jujur, bukan karangan. */
          <Reveal always={ratingsEnabled()}>
            <div className="rounded-lg border border-dashed border-paper/25 bg-sambal-950 px-6 py-10 text-center md:py-12">
              <p className="font-display text-xl text-paper md:text-2xl">
                {testimonialsCopy.emptyText}
              </p>
              <p className="mt-2 text-sm text-paper/60">
                {testimonialsCopy.emptyHint}
              </p>
            </div>
          </Reveal>
        )}

        {/* Beri rating — muncul hanya kalau backend sudah dipasang */}
        {ratingsEnabled() && (
          <Reveal className="mt-10">
            {formOpen ? (
              <RatingForm onClose={() => setFormOpen(false)} />
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-gold-400/60 px-6 py-3 text-sm font-bold uppercase tracking-wide text-gold-300 transition-colors duration-150 hover:bg-gold-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                >
                  <Star className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                  {ratingCopy.ctaOpen}
                </button>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

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
 * pengunjung masih boleh pindah dari 👍 ke 👎 atau sebaliknya.
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
    if (!r.id || busy || voted === dir) return;
    setBusy(true);
    const prev = voted;

    // Ubah tampilan dulu biar terasa instan. Kalau gagal terkirim,
    // penyegaran berikutnya mengembalikan angka yang sebenarnya.
    setVoted(dir);
    setUp((n) => Math.max(0, n + (dir === "up" ? 1 : 0) - (prev === "up" ? 1 : 0)));
    setDown((n) => Math.max(0, n + (dir === "down" ? 1 : 0) - (prev === "down" ? 1 : 0)));

    try {
      await submitVote({ id: r.id, dir, prev: prev || undefined });
      saveVote(r.id, dir);
    } catch {
      /* biarkan — angka asli kembali saat penyegaran berikutnya */
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition-colors duration-150 disabled:opacity-60";

  return (
    <div className="mt-3 flex items-center gap-2 text-xs">
      <button
        type="button"
        onClick={() => vote("up")}
        disabled={busy}
        aria-pressed={voted === "up"}
        aria-label="Membantu"
        title="Membantu"
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
        aria-label="Kurang membantu"
        title="Kurang membantu"
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
  /** null = belum ada ulasan asli → tampilkan draf yang ada. */
  const [reviews, setReviews] = useState<Rating[] | null>(null);
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
        setReviews(items.length > 0 ? items : null);
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

  let views: ReviewView[];
  let summaryScore = testimonialsCopy.summaryScore;
  let summaryText = testimonialsCopy.summaryText;
  let summaryStars = 5;

  if (real) {
    // Yang punya cerita diutamakan jadi kutipan besar.
    const withText = real.filter((r) => r.comment.trim() !== "");
    const featured = withText[0] ?? real[0];
    const others = real.filter((r) => r !== featured);

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
  } else {
    views = testimonialsCopy.items.map((t) => ({
      name: t.name,
      meta: t.role,
      rating: t.rating,
      text: t.text,
      up: 0,
      down: 0,
    }));
  }

  // Kutipan besar + maksimal 7 kartu + sel angka = grid tetap lega.
  const [featured, ...others] = views;
  const rest = others.slice(0, 7);

  return (
    <section className="bg-ink py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl leading-tight text-paper md:text-5xl">
            {testimonialsCopy.heading}
          </h2>
          <p className="font-display text-sm uppercase tracking-[0.22em] text-gold-400">
            {testimonialsCopy.note}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Kutipan utama — sel dominan */}
          <blockquote className="rounded-lg border border-paper/15 bg-sambal-950 p-8 md:col-span-2">
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
              <Stars rating={featured.rating} />
            </footer>
            <Votes r={featured} />
          </blockquote>

          {rest.map((t, i) => (
            <blockquote
              key={i}
              className="rounded-lg border border-paper/15 p-6"
            >
              <Stars rating={t.rating} />
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
              <Votes r={t} />
            </blockquote>
          ))}

          {/* Sel angka — penutup baris (break rhythm) */}
          <div className="flex flex-col justify-between rounded-lg bg-gold-600 p-6 text-ink">
            <Stars rating={summaryStars} className="text-ink" />
            <div>
              <p className="font-display text-4xl">{summaryScore}</p>
              <p className="mt-1 text-sm font-medium">{summaryText}</p>
            </div>
          </div>
        </div>

        {/* Beri rating — muncul hanya kalau backend sudah dipasang */}
        {ratingsEnabled() && (
          <div className="mt-10">
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
          </div>
        )}
      </div>
    </section>
  );
}

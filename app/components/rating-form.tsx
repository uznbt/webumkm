"use client";

import { Fragment, useState, type FormEvent } from "react";
import { Check, Star, X } from "lucide-react";
import { ratingCopy } from "../data/content";
import { submitRating } from "../lib/ratings";

type Status = "idle" | "sending" | "success" | "error";

export default function RatingForm({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // jebakan bot — harus tetap kosong
  const [status, setStatus] = useState<Status>("idle");
  const [needRating, setNeedRating] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    if (rating < 1) {
      setNeedRating(true);
      return;
    }
    setNeedRating(false);
    setStatus("sending");

    try {
      await submitRating({ rating, name, comment, website });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-gold-400/40 bg-sambal-950 p-8 text-center">
        <Check className="mx-auto h-10 w-10 text-gold-400" aria-hidden="true" />
        <p className="mt-4 font-display text-2xl text-paper">
          {ratingCopy.successTitle}
        </p>
        <p className="mt-2 text-sm text-paper/75">{ratingCopy.successBody}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-md border border-paper/25 px-5 py-2 text-sm font-bold uppercase tracking-wide text-paper transition-colors duration-150 hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
        >
          {ratingCopy.ctaClose}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-paper/15 bg-sambal-950 p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-paper">{ratingCopy.heading}</h3>
          <p className="mt-1 text-sm text-paper/70">{ratingCopy.note}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={ratingCopy.ctaClose}
          className="rounded-sm p-1 text-paper/60 transition-colors duration-150 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Pilih bintang */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div
          className="rating-picker"
          role="radiogroup"
          aria-label={ratingCopy.starsGroupLabel}
        >
          {/* Urutan DOM dibalik (5→1): lihat penjelasan di globals.css */}
          {[5, 4, 3, 2, 1].map((n) => (
            <Fragment key={n}>
              <input
                type="radio"
                id={`rating-star-${n}`}
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => {
                  setRating(n);
                  setNeedRating(false);
                }}
              />
              <label
                htmlFor={`rating-star-${n}`}
                title={ratingCopy.starTitles[n - 1]}
                aria-label={`${n} dari 5 — ${ratingCopy.starTitles[n - 1]}`}
              >
                <Star aria-hidden="true" />
              </label>
            </Fragment>
          ))}
        </div>
        <span className="text-sm text-paper/70" aria-live="polite">
          {rating > 0 ? ratingCopy.starTitles[rating - 1] : ""}
        </span>
      </div>
      {needRating && (
        <p className="mt-2 text-sm font-bold text-gold-300">
          {ratingCopy.needRating}
        </p>
      )}

      {/* Jebakan bot: tersembunyi dari manusia & pembaca layar */}
      <div
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="rating-website">Website</label>
        <input
          id="rating-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-paper/85">
            {ratingCopy.nameLabel}
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder={ratingCopy.namePlaceholder}
            className="w-full rounded-md border border-paper/25 bg-ink/40 px-4 py-2.5 text-paper transition-colors duration-150 placeholder:text-paper/40 focus:border-gold-400 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-paper/85">
            {ratingCopy.commentLabel}
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={ratingCopy.commentPlaceholder}
            className="w-full resize-y rounded-md border border-paper/25 bg-ink/40 px-4 py-2.5 text-paper transition-colors duration-150 placeholder:text-paper/40 focus:border-gold-400 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-md bg-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors duration-150 hover:bg-gold-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300 disabled:opacity-60"
        >
          <Star className="h-4 w-4" fill="currentColor" aria-hidden="true" />
          {status === "sending" ? ratingCopy.submitting : ratingCopy.submit}
        </button>
        {status === "error" && (
          <p className="text-sm font-bold text-sambal-300">{ratingCopy.errorText}</p>
        )}
      </div>
    </form>
  );
}

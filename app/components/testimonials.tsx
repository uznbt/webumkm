import { Star } from "lucide-react";
import { testimonialsCopy } from "../data/content";

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

export default function TestimonialsSection() {
  const [featured, ...rest] = testimonialsCopy.items;

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
              &ldquo;{featured.text}&rdquo;
            </p>
            <footer className="mt-6 flex items-center justify-between gap-4">
              <span>
                <span className="block font-bold text-paper">
                  {featured.name}
                </span>
                <span className="block text-sm text-paper/70">
                  {featured.role}
                </span>
              </span>
              <Stars rating={featured.rating} />
            </footer>
          </blockquote>

          {rest.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-lg border border-paper/15 p-6"
            >
              <Stars rating={t.rating} />
              <p className="mt-3 text-sm leading-relaxed text-paper/85">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="mt-4">
                <span className="block text-sm font-bold text-paper">
                  {t.name}
                </span>
                <span className="block text-xs text-paper/70">{t.role}</span>
              </p>
            </blockquote>
          ))}

          {/* Sel angka — penutup baris (break rhythm) */}
          <div className="flex flex-col justify-between rounded-lg bg-gold-600 p-6 text-ink">
            <Stars rating={5} className="text-ink" />
            <div>
              <p className="font-display text-4xl">
                {testimonialsCopy.summaryScore}
              </p>
              <p className="mt-1 text-sm font-medium">
                {testimonialsCopy.summaryText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

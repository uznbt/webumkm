import { ArrowRight, Leaf, ShieldCheck, Star } from "lucide-react";
import { MapPin } from "./icons";
import Reveal from "./ui/reveal";
import { featuresCopy, type FeatureIcon } from "../data/content";

/* Nama ikon di data/content.ts → komponen ikon. */
const featureIcons: Record<FeatureIcon, typeof Star> = {
  star: Star,
  leaf: Leaf,
  shield: ShieldCheck,
  pin: MapPin,
};

export default function FeaturesSection() {
  return (
    <section id="why-us" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="lg:grid lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* Statement — kolom kiri */}
          <Reveal className="max-w-md">
            <p className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
              {featuresCopy.kicker}
            </p>
            <h2 className="mb-5 font-display text-4xl leading-tight md:text-5xl">
              {featuresCopy.heading}
            </h2>
            <p className="mb-6 text-ink/70">{featuresCopy.paragraph}</p>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-sm text-sm font-bold text-sambal-700 transition-colors duration-150 hover:text-sambal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700"
            >
              {featuresCopy.linkLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>

          {/* Daftar bernomor — bukan grid kartu */}
          <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10 lg:mt-0">
            {featuresCopy.items.map((feature, index) => {
              const Icon = featureIcons[feature.icon];
              return (
                <li key={feature.title}>
                  <Reveal
                    className="flex gap-5 py-6"
                    delay={Math.min(index * 50, 200)}
                  >
                    <span
                      className="w-8 shrink-0 pt-0.5 font-display text-lg text-gold-800"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className="mt-1 h-5 w-5 shrink-0 text-sambal-700"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="mb-1 font-bold">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-ink/70">
                        {feature.description}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

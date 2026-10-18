import { ArrowRight, Check } from "lucide-react";
import { common, heroCopy } from "../data/content";
import { assetUrl, WHATSAPP_LINK } from "../lib/constants";
import ButtonLink from "./ui/button-link";
import { WhatsApp } from "./icons";

/** Ubah *kata* dari data content menjadi teks berwarna merah. */
function AccentText({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="text-sambal-600">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function Hero() {
  return (
    <section id="home" className="bg-paper pt-32 pb-20 md:pt-44 md:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-14">
          {/* Copy — kolom lebar (asimetris) */}
          <div className="lg:col-span-7">
            <p className="mb-5 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
              {heroCopy.kicker}
            </p>
            <h1 className="mb-6 whitespace-pre-line font-display text-[clamp(2rem,8vw,3rem)] leading-[1.08] md:text-6xl xl:text-7xl">
              <AccentText text={heroCopy.headline} />
            </h1>
            <p className="mb-8 max-w-prose text-lg text-ink/75">
              {heroCopy.subheadline}
            </p>

            <ul className="mb-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-ink/80">
              {heroCopy.bullets.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-sambal-700" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-x-7">
              <ButtonLink
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="w-full px-6 py-3.5 sm:w-auto sm:py-3"
              >
                <WhatsApp className="h-4 w-4" aria-hidden="true" />
                {common.whatsappCta}
              </ButtonLink>
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 rounded-sm py-1.5 text-sm font-bold text-ink transition-colors duration-150 hover:text-sambal-700 active:text-sambal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700 sm:justify-start sm:py-0"
              >
                {heroCopy.secondaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Foto menu — kolom sempit, blok merah offset (block-based) */}
          <div className="relative mt-16 lg:col-span-5 lg:mt-0 lg:translate-y-4">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg bg-sambal-600"
            />
            <figure className="relative grid place-items-center overflow-hidden rounded-lg border border-ink/10 bg-white p-5 md:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetUrl("/menu/nasi-goreng.webp")}
                alt={heroCopy.imageAlt}
                width={366}
                height={225}
                className="w-full object-contain"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

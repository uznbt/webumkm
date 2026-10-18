import type { Metadata } from "next";
import { site } from "./data/site";
import { notFoundCopy } from "./data/content";
import { assetUrl } from "./lib/constants";
import ButtonLink from "./components/ui/button-link";

export const metadata: Metadata = {
  title: `Halaman tidak ditemukan — ${site.brand.name}`,
};

export default function NotFound() {
  return (
    <main className="grid min-h-[75vh] place-items-center bg-paper px-6 pt-32 pb-20">
      <div className="max-w-xl text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(site.brand.logo)}
          alt={site.brand.name}
          width={512}
          height={512}
          className="mx-auto h-16 w-16"
        />
        <p className="mt-6 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
          {notFoundCopy.kicker}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-ink md:text-5xl">
          {notFoundCopy.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink/75">{notFoundCopy.body}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/" variant="primary" className="w-full sm:w-auto">
            {notFoundCopy.homeCta}
          </ButtonLink>
          <ButtonLink
            href="/#menu"
            variant="outline"
            className="w-full sm:w-auto"
          >
            {notFoundCopy.menuCta}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}

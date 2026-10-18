"use client";

import { useState } from "react";
import { menuItems, type MenuItem } from "../data/menu";
import { menuCopy } from "../data/content";
import { assetUrl } from "../lib/constants";
import Reveal from "./ui/reveal";

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white">
      {/* Foto menu (transparan) di atas alas krem */}
      <div className="grid h-28 place-items-center bg-cream/50 p-3 sm:h-36 sm:p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(item.image)}
          alt={item.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Nama & keterangan */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-1 text-sm font-bold sm:text-base">{item.name}</h3>
        <p className="text-xs leading-relaxed text-ink/65 sm:text-sm">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export default function MenuGrid() {
  const categories = [
    "all",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading kiri + catatan kanan (asimetris) */}
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
              {menuCopy.kicker}
            </p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              {menuCopy.heading}
            </h2>
          </div>
          <p className="max-w-xs text-sm text-ink/60">{menuCopy.note}</p>
        </Reveal>

        {/* Filter kategori — muncul otomatis dari kategori menu */}
        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-bold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 ${
                  activeCategory === category
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink/70 hover:border-sambal-600 hover:text-sambal-700"
                }`}
              >
                {category === "all" ? menuCopy.allCategories : category}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visibleItems.map((item, index) => (
            <Reveal
              key={item.name}
              className="h-full"
              delay={(index % 4) * 75}
            >
              <MenuCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ChevronDown } from "lucide-react";
import { faqCopy } from "../data/content";

export default function FaqSection() {
  return (
    <section id="faq" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <p className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
            {faqCopy.kicker}
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            {faqCopy.heading}
          </h2>

          <div className="mt-10 border-t border-ink/10">
            {faqCopy.items.map((item) => (
              <details key={item.question} className="group border-b border-ink/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-sambal-700 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-prose pb-5 text-sm leading-relaxed text-ink/70">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

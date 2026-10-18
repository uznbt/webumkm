import Reveal from "./ui/reveal";
import CountUp from "./ui/count-up";
import { stats } from "../data/content";

export default function StatsBand() {
  return (
    <section aria-label="Pencapaian kami" className="bg-sambal-700 py-12 md:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90}>
              <div>
                <dd className="font-display text-3xl tabular-nums text-paper md:text-4xl">
                  <CountUp value={stat.value} />
                </dd>
                <dt className="mt-1 text-sm font-medium text-sambal-100">
                  {stat.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

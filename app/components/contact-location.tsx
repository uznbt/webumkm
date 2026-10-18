import { MapPin, Phone, Mail, Clock } from "./icons";
import Reveal from "./ui/reveal";
import OpenBadge from "./open-badge";
import { site } from "../data/site";
import { contactCopy } from "../data/content";
import { MAPS_EMBED_URL, WHATSAPP_LINK } from "../lib/constants";

export default function ContactLocationSection() {
  return (
    <section id="contact" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-14">
          {/* Info kontak — duluan di mobile, kanan di desktop */}
          <Reveal>
            <p className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
              {contactCopy.kicker}
            </p>
            <h2 className="mb-8 font-display text-4xl leading-tight md:text-5xl">
              {contactCopy.heading}
            </h2>

            <dl className="space-y-6">
              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-sambal-600/30 bg-sambal-50 text-sambal-700">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="mb-1 font-bold">{contactCopy.addressLabel}</dt>
                  <dd className="text-sm leading-relaxed text-ink/70">
                    <span className="block">{site.contact.addressLine1}</span>
                    <span className="block">{site.contact.addressLine2}</span>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-sambal-600/30 bg-sambal-50 text-sambal-700">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="mb-1 font-bold">{contactCopy.hoursLabel}</dt>
                  <dd className="text-sm leading-relaxed text-ink/70">
                    {site.contact.hours.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    <OpenBadge className="mt-2" />
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-sambal-600/30 bg-sambal-50 text-sambal-700">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="mb-1 font-bold">{contactCopy.phoneLabel}</dt>
                  <dd className="text-sm text-ink/70">
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                    >
                      {site.contact.whatsappDisplay}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-sambal-600/30 bg-sambal-50 text-sambal-700">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="mb-1 font-bold">{contactCopy.emailLabel}</dt>
                  <dd className="text-sm text-ink/70">
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="rounded-sm transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                    >
                      {site.contact.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>

          {/* Peta — bawah di mobile, kiri di desktop (inversi dari hero) */}
          <Reveal className="mt-10 lg:order-first lg:mt-0" delay={120}>
            <div className="overflow-hidden rounded-lg border border-ink/10 bg-cream">
              <iframe
                src={MAPS_EMBED_URL}
                title={contactCopy.mapTitle}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0 md:h-[420px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

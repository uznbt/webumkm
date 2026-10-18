import { site } from "../data/site";
import { menuItems } from "../data/menu";
import { faqCopy, menuCopy } from "../data/content";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Data terstruktur (JSON-LD) untuk Google: profil kedai, daftar
 * menu (dikelompokkan per kategori), dan FAQ. Semua otomatis dari
 * file data — tidak perlu diubah manual saat menambah menu.
 */
export default function StructuredData() {
  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const graph = [
    {
      "@type": "Restaurant",
      "@id": `${site.url}/#business`,
      name: site.brand.name,
      description: site.meta.description,
      url: site.url,
      image: `${site.url}${site.brand.logo}`,
      telephone: `+${site.contact.whatsappNumber}`,
      email: site.contact.email,
      servesCuisine: "Indonesian",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.contact.addressLine1,
        addressLocality: site.contact.city,
        addressRegion: site.contact.region,
        postalCode: site.contact.postalCode,
        addressCountry: "ID",
      },
      sameAs: [site.socials.instagram, site.socials.tiktok],
      openingHoursSpecification: site.contact.schedule.map((entry) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: entry.days.map((day) => DAY_NAMES[day]),
        opens: entry.open,
        closes: entry.close,
      })),
      hasMenu: {
        "@type": "Menu",
        name: menuCopy.heading,
        hasMenuSection: categories.map((category) => ({
          "@type": "MenuSection",
          name: category,
          hasMenuItem: menuItems
            .filter((item) => item.category === category)
            .map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
            })),
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqCopy.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  // Jaga-jaga keamanan: "<" diubah jadi \u003c supaya teks mana pun
  // (walau nanti berasal dari luar) tidak bisa menutup tag <script> ini.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}

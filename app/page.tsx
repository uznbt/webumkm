import Navbar from "@/app/components/navbar";
import Hero from "@/app/components/hero";
import FeaturesSection from "@/app/components/features";
import StatsBand from "@/app/components/stats-band";
import MenuGrid from "@/app/components/menu-grid";
import FaqSection from "@/app/components/faq";
import TestimonialsSection from "@/app/components/testimonials";
import ContactLocationSection from "@/app/components/contact-location";
import Footer from "@/app/components/footer";
import FloatingWhatsApp from "@/app/components/floating-whatsapp";
import StructuredData from "@/app/components/structured-data";

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <main id="konten" className="flex min-h-screen flex-col">
        <Navbar />
        <Hero />
        <FeaturesSection />
        <StatsBand />
        <MenuGrid />
        <FaqSection />
        <TestimonialsSection />
        <ContactLocationSection />
        <Footer />
      </main>
      <FloatingWhatsApp />
    </>
  );
}

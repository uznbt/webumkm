import type { Metadata } from "next";
import Navbar from "@/app/components/navbar";
import Hero from "@/app/components/hero";
import FeaturesSection from "@/app/components/features";
import StatsBand from "@/app/components/stats-band";
import MenuGrid from "@/app/components/menu-grid";
import FaqSection from "@/app/components/faq";
import TestimonialsSection from "@/app/components/testimonials";
import ContactLocationSection from "@/app/components/contact-location";
import Footer from "@/app/components/footer";
import AiChat from "@/app/components/ai-chat";
import StructuredData from "@/app/components/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Navbar />
      <main id="konten" className="flex-1">
        <Hero />
        <FeaturesSection />
        <StatsBand />
        <MenuGrid />
        <FaqSection />
        <TestimonialsSection />
        <ContactLocationSection />
      </main>
      <Footer />
      <AiChat />
    </>
  );
}

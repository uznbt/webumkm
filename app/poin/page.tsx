import type { Metadata } from "next";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import PoinClient from "@/app/components/poin/poin-client";
import { poinCopy } from "@/app/data/poin";

export const metadata: Metadata = {
  title: poinCopy.meta.title,
  description: poinCopy.meta.description,
  alternates: { canonical: "/poin" },
};

export default function PoinPage() {
  return (
    <main id="konten" className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <PoinClient />
      </div>
      <Footer />
    </main>
  );
}

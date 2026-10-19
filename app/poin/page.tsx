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
    <>
      <Navbar />
      <main id="konten" className="flex-1">
        <PoinClient />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import KasirClient from "@/app/components/poin/kasir-client";
import { kasirCopy } from "@/app/data/poin";

export const metadata: Metadata = {
  title: kasirCopy.metaTitle,
  robots: { index: false, follow: false },
};

export default function KasirPage() {
  return (
    <main id="konten">
      <KasirClient />
    </main>
  );
}

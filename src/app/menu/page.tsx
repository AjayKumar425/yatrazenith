"use client";

import { useSmoothScroll } from "@/lib/useSmoothScroll";
import MenuCatalog from "@/components/MenuCatalog";
import Footer from "@/components/Footer";

export default function MenuPage() {
  useSmoothScroll();

  return (
    <main>
      <MenuCatalog />
      <Footer />
    </main>
  );
}

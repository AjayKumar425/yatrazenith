"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import MenuCatalog from "@/components/MenuCatalog";
import Footer from "@/components/Footer";

export default function MenuPage() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <MenuCatalog />
      <Footer />
    </main>
  );
}

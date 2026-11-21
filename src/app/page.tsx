"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Preloader from "@/components/Preloader";
import Landing from "@/components/Landing";
import Philo from "@/components/Philo";
import Des from "@/components/Des";
import JourneyPlanner from "@/components/JourneyPlanner";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
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
    <main className={styles.main}>
      <Preloader />
      <Landing />
      <Philo />
      <Des />
      <JourneyPlanner />
      <Footer />
    </main>
  );
}

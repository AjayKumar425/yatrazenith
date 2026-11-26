"use client";

import { useSmoothScroll } from "@/lib/useSmoothScroll";
import Preloader from "@/components/Preloader";
import Landing from "@/components/Landing";
import Philo from "@/components/Philo";
import Des from "@/components/Des";
import Sanctuaries from "@/components/Sanctuaries";
import JourneyPlanner from "@/components/JourneyPlanner";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  useSmoothScroll();

  return (
    <main className={styles.main}>
      <Preloader />
      <Landing />
      <Des />
      <Philo />
      <Sanctuaries />
      <JourneyPlanner />
      <Footer />
    </main>
  );
}

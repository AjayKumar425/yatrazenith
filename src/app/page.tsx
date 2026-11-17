"use client";

import styles from "./page.module.css";
import Landing from "@/components/Landing";
import Philo from "@/components/Philo";
import Des from "@/components/Des";

export default function Home() {
  return (
    <main className={styles.main}>
      <Landing />
      <Philo />
      <Des />
    </main>
  );
}

"use client";

import styles from "./page.module.css";
import Landing from "@/components/Landing";
import Des from "@/components/Des";

export default function Home() {
  return (
    <main className={styles.main}>
      <Landing />
      <Des />
    </main>
  );
}

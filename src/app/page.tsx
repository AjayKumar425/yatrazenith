"use client";

import Header from "@/components/Header";
import styles from "./page.module.css";
import Landing from "@/components/Landing";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Landing />
    </main>
  );
}

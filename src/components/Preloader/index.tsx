"use client";

import Image from "next/image";
import styles from "./style.module.scss";

interface PreloaderProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

export default function Preloader({
  title = "Yatra Zenith",
  subtitle = "The",
  tagline = "Himalayan Sanctuary",
}: PreloaderProps) {
  return (
    <div className={styles.preloader}>
      <div className={styles.preloaderInner}>
        <Image
          src="/images/logo.png"
          alt="Yatra Zenith"
          width={96}
          height={96}
          className={styles.logoImage}
          priority
        />
        <div className={styles.wordmark}>
          <span className={styles.wordmarkThe}>{subtitle}</span>
          <h2 className={styles.wordmarkTitle}>{title}</h2>
          <span className={styles.wordmarkTag}>{tagline}</span>
        </div>
      </div>
    </div>
  );
}

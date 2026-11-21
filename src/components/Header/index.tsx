"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { navLinks, contactLinks, socialLinks } from "./data";
import styles from "./style.module.scss";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [istTime, setIstTime] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onReveal = () => setHasRevealed(true);
    window.addEventListener("reveal-header", onReveal);
    const fallback = window.setTimeout(() => setHasRevealed(true), 2200);

    const onScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.72);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    const updateTime = () => {
      setIstTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };
    updateTime();
    const clock = window.setInterval(updateTime, 30000);

    return () => {
      window.removeEventListener("reveal-header", onReveal);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(fallback);
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    gsap.to(overlayRef.current, {
      clipPath: isOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      duration: 0.85,
      ease: "expo.inOut",
      pointerEvents: isOpen ? "auto" : "none",
    });
  }, [isOpen]);

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${
          isOpen ? styles.menuOpen : ""
        } ${hasRevealed ? styles.revealed : ""}`}
      >
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
        >
          <span className={styles.hamburger} aria-hidden="true">
            <span />
            <span />
          </span>
          <span>{isOpen ? "Close" : "Menu"}</span>
        </button>

        <Link href="/" className={styles.brand} onClick={() => setIsOpen(false)}>
          <Image src="/images/logo.png" alt="Yatra Zenith" width={34} height={34} priority />
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Yatra Zenith</span>
            <span className={styles.brandSub}>Journeys Above the Ordinary</span>
          </span>
        </Link>

        <div className={styles.actions}>
          <Link href="#plan" className={styles.cta} onClick={() => setIsOpen(false)}>
            Plan Your Journey
          </Link>
        </div>
      </header>

      <nav ref={overlayRef} className={styles.overlay} aria-label="Primary Navigation">
        <ul className={styles.navList}>
          {navLinks.map((item) => (
            <li key={item.num}>
              <Link href={item.href} className={styles.navLink} onClick={() => setIsOpen(false)}>
                <span className={styles.navNum}>{item.num}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.overlayFooter}>
          <span>Dehradun &amp; Leh Atelier · {istTime} IST</span>
          <div className={styles.footerLinks}>
            {contactLinks.map((c) => (
              <a key={c.label} href={c.href}>{c.label}</a>
            ))}
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

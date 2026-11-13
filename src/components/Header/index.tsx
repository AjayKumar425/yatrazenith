"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import styles from "./style.module.scss";
import { navLinks, contactLinks, socialLinks } from "./data";

gsap.registerPlugin(useGSAP, SplitText);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const footerLeftRef = useRef<HTMLDivElement>(null);
  const footerRightRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  const barSplitsRef = useRef<SplitText[]>([]);
  const navSplitsRef = useRef<SplitText[]>([]);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // ---- Cleanup helpers ----
  const cleanupSplits = useCallback((ref: React.RefObject<SplitText[]>) => {
    ref.current.forEach((s) => {
      try { s.revert(); } catch { /* safe */ }
    });
    ref.current = [];
  }, []);

  // ---- Initial reveal (triggered by landing page "reveal-header" event) ----
  const revealHeader = useCallback(() => {
    if (hasRevealed || !headerRef.current) return;
    setHasRevealed(true);

    cleanupSplits(barSplitsRef);

    // Split the top bar text elements
    const textTargets = headerRef.current.querySelectorAll<HTMLElement>(
      `.${styles.brandTitle}, .${styles.brandSub}, .${styles.menuLabel}, .${styles.ctaPill}`
    );

    const parentSplits: SplitText[] = [];
    const childSplits: SplitText[] = [];

    textTargets.forEach((target) => {
      const parent = new SplitText(target, {
        type: "lines",
        linesClass: styles.lineMask,
      });
      const child = new SplitText(parent.lines, {
        type: "lines",
        linesClass: styles.lineInner,
      });
      parentSplits.push(parent);
      childSplits.push(child);
    });

    barSplitsRef.current = [...parentSplits, ...childSplits];
    const innerLines = childSplits.flatMap((c) => c.lines);

    // Set initial states
    gsap.set(headerRef.current, { opacity: 1 });
    gsap.set(innerLines, { yPercent: 120, opacity: 0 });

    const logoImg = headerRef.current.querySelector(`.${styles.logoImg}`);
    const hamburgerIcon = headerRef.current.querySelector(`.${styles.hamburgerIcon}`);
    const ctaPill = headerRef.current.querySelector(`.${styles.ctaPill}`);

    gsap.set([logoImg, hamburgerIcon, ctaPill].filter(Boolean), { opacity: 0, y: -8 });

    // Animate in
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.to(
      [hamburgerIcon, logoImg, ctaPill].filter(Boolean),
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 },
      0
    );

    tl.to(
      innerLines,
      { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.04 },
      0.1
    );
  }, [hasRevealed, cleanupSplits]);

  // Listen for the reveal event
  useEffect(() => {
    const handleReveal = () => revealHeader();
    window.addEventListener("reveal-header", handleReveal);

    // Fallback timeout
    const timer = setTimeout(() => revealHeader(), 2400);

    return () => {
      window.removeEventListener("reveal-header", handleReveal);
      clearTimeout(timer);
      cleanupSplits(barSplitsRef);
    };
  }, [revealHeader, cleanupSplits]);

  // ---- Open / Close overlay ----
  const openMenu = useCallback(() => {
    if (!overlayRef.current || !navListRef.current) return;

    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
    }
    cleanupSplits(navSplitsRef);

    // SplitText on nav links
    const navLinkEls = navListRef.current.querySelectorAll<HTMLElement>(`.${styles.navLink}`);
    const parentSplits: SplitText[] = [];
    const childSplits: SplitText[] = [];

    navLinkEls.forEach((el) => {
      const parent = new SplitText(el, {
        type: "lines",
        linesClass: styles.lineMask,
      });
      const child = new SplitText(parent.lines, {
        type: "lines",
        linesClass: styles.lineInner,
      });
      parentSplits.push(parent);
      childSplits.push(child);
    });

    navSplitsRef.current = [...parentSplits, ...childSplits];
    const navInnerLines = childSplits.flatMap((c) => c.lines);

    // Initial states
    gsap.set(navInnerLines, { yPercent: 110, opacity: 0 });
    gsap.set(
      [footerLeftRef.current, footerRightRef.current].filter(Boolean),
      { opacity: 0, y: 12 }
    );

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
    });
    openTimelineRef.current = tl;

    // 1. Slide overlay panel down (clip-path reveal)
    tl.to(overlayRef.current, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.9,
      ease: "expo.inOut",
    }, 0);

    // 2. Nav links SplitText reveal
    tl.to(navInnerLines, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.06,
      ease: "expo.out",
    }, 0.35);

    // 3. Footer sections fade in
    tl.to(
      [footerLeftRef.current, footerRightRef.current].filter(Boolean),
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
      0.65
    );
  }, [cleanupSplits]);

  const closeMenu = useCallback(() => {
    if (!overlayRef.current) return;

    if (openTimelineRef.current) {
      openTimelineRef.current.kill();
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        cleanupSplits(navSplitsRef);
        gsap.set(
          [footerLeftRef.current, footerRightRef.current].filter(Boolean),
          { opacity: 0, y: 12 }
        );
      },
    });
    openTimelineRef.current = tl;

    // Slide overlay back up
    tl.to(overlayRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.75,
      ease: "expo.inOut",
    }, 0);
  }, [cleanupSplits]);

  // Toggle handler
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        openMenu();
      } else {
        closeMenu();
      }
      return next;
    });
  }, [openMenu, closeMenu]);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleToggle();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleToggle]);

  return (
    <header className={styles.header} ref={headerRef}>
      {/* ================================================================
          Top Bar — always fixed on top (both closed & open)
          ================================================================ */}
      <div className={styles.topBar} ref={topBarRef}>
        {/* Left: Hamburger / Close */}
        <button
          type="button"
          className={`${styles.menuToggle} ${isOpen ? styles.dark : ""}`}
          onClick={handleToggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span className={`${styles.hamburgerIcon} ${isOpen ? styles.hamburgerOpen : ""}`}>
            <span />
            <span />
          </span>
          <span className={styles.menuLabel}>
            {isOpen ? "Close" : "Menu"}
          </span>
        </button>

        {/* Center: Brand (stays visible, transitions to dark mode in menu) */}
        <Link
          href="/"
          className={`${styles.brand} ${isOpen ? styles.dark : ""}`}
          onClick={() => isOpen && handleToggle()}
        >
          <Image
            src="/images/logo.png"
            alt="Yatra Zenith"
            width={36}
            height={36}
            className={styles.logoImg}
            priority
          />
          <div className={styles.brandTextGroup}>
            <span className={styles.brandTitle}>Yatra</span>
            <span className={styles.brandSub}>Zenith / Journeys Above the Ordinary</span>
          </div>
        </Link>

        {/* Right: CTA Pill (stays visible, transitions to dark mode in menu) */}
        <Link
          href="#plan"
          className={`${styles.ctaPill} ${isOpen ? styles.dark : ""}`}
          onClick={() => isOpen && handleToggle()}
        >
          Plan Your Journey
        </Link>
      </div>

      {/* ================================================================
          Overlay Panel — the dropdown menu
          ================================================================ */}
      <div className={styles.overlay} ref={overlayRef}>
        {/* Nav Links */}
        <div className={styles.overlayBody}>
          <ul className={styles.navList} ref={navListRef}>
            {navLinks.map((item) => (
              <li key={item.title} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  onClick={() => isOpen && handleToggle()}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: Contact + Socials */}
        <div className={styles.overlayFooter}>
          <div className={styles.footerSection} ref={footerLeftRef}>
            <span className={styles.footerLabel}>Contact</span>
            {contactLinks.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.label}: {c.value}
              </a>
            ))}
          </div>
          <div className={styles.footerSectionRight} ref={footerRightRef}>
            <span className={styles.footerLabel}>Socials</span>
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className={styles.footerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

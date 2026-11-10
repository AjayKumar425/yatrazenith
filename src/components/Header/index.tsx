"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import styles from "./style.module.scss";
import { navLinks } from "./data";

gsap.registerPlugin(useGSAP, SplitText);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const [hasRevealed, setHasRevealed] = useState(false);
  const splitsRef = useRef<SplitText[]>([]);

  // Cleanup SplitText instances
  const cleanupSplits = useCallback(() => {
    splitsRef.current.forEach((split) => {
      try {
        split.revert();
      } catch {
        // Safe cleanup
      }
    });
    splitsRef.current = [];
  }, []);

  // SplitText Mask Reveal for Header elements
  const revealHeader = useCallback(() => {
    if (hasRevealed || !headerRef.current) return;
    setHasRevealed(true);

    cleanupSplits();

    // Split text targets: brand text, nav links, button text
    const textTargets = headerRef.current.querySelectorAll<HTMLElement>(
      `.${styles.brandYatra}, .${styles.brandZenith}, .${styles.navLink}, .${styles.planTripBtn} span:first-child`
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

    splitsRef.current = [...parentSplits, ...childSplits];

    const innerLines = childSplits.flatMap((c) => c.lines);

    // Initial state: lines pushed down below masks, icons hidden
    gsap.set(headerRef.current, { opacity: 1 });
    gsap.set(innerLines, { yPercent: 120, opacity: 0 });

    const logoImg = headerRef.current.querySelector(`.${styles.logoImg}`);
    const searchBtn = headerRef.current.querySelector(`.${styles.searchBtn}`);
    const planTripBtn = headerRef.current.querySelector(`.${styles.planTripBtn}`);
    const activeIndicator = headerRef.current.querySelector(
      `.${styles.activeIndicator}`
    );

    gsap.set([logoImg, searchBtn, planTripBtn], { opacity: 0, y: -10 });
    if (activeIndicator) {
      gsap.set(activeIndicator, { scaleX: 0, transformOrigin: "left center" });
    }

    // Header Reveal Timeline
    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
    });

    // 1. Logo & Button containers fade in
    tl.to(
      [logoImg, planTripBtn, searchBtn],
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.1,
      },
      0
    );

    // 2. SplitText masked lines slide up
    tl.to(
      innerLines,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.04,
      },
      0.15
    );

    // 3. Active indicator bar draws
    if (activeIndicator) {
      tl.to(
        activeIndicator,
        {
          scaleX: 1,
          duration: 1.0,
          ease: "expo.out",
        },
        0.5
      );
    }
  }, [hasRevealed, cleanupSplits]);

  // Listen for reveal event or fallback timer
  useEffect(() => {
    const handleReveal = () => {
      revealHeader();
    };

    window.addEventListener("reveal-header", handleReveal);

    // Fallback in case event already fired or header loaded standalone
    const timer = setTimeout(() => {
      revealHeader();
    }, 2400);

    return () => {
      window.removeEventListener("reveal-header", handleReveal);
      clearTimeout(timer);
      cleanupSplits();
    };
  }, [revealHeader, cleanupSplits]);

  return (
    <header className={styles.header} ref={headerRef}>
      {/* Brand: Circular Logo + YATRA ZENITH */}
      <Link href="/" className={styles.brand} ref={brandRef}>
        <Image
          src="/images/logo.png"
          alt="Yatra Zenith"
          width={42}
          height={42}
          className={styles.logoImg}
          priority
        />
        <div className={styles.brandText}>
          <span className={styles.brandYatra}>Yatra</span>
          <span className={styles.brandZenith}>✦ Zenith ✦</span>
        </div>
      </Link>

      {/* Nav links: Home, Destinations, About, Journal */}
      <nav>
        <ul className={styles.nav} ref={navRef}>
          {navLinks.map((item) => (
            <li key={item.title} className={styles.navItem}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${item.isActive ? styles.active : ""}`}
              >
                {item.title}
              </Link>
              {item.isActive && <div className={styles.activeIndicator} />}
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Actions: Search Icon + Plan Your Trip Button */}
      <div className={styles.actions} ref={actionsRef}>
        <button
          type="button"
          className={styles.searchBtn}
          aria-label="Search"
          title="Search"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <Link href="#plan" className={styles.planTripBtn}>
          <span>Plan Your Trip</span>
          <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </header>
  );
}

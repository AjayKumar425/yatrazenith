"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { navLinks, contactLinks, socialLinks } from "./data";
import styles from "./style.module.scss";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [istTime, setIstTime] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onReveal = () => setHasRevealed(true);
    window.addEventListener("reveal-header", onReveal);
    const fallback = window.setTimeout(() => setHasRevealed(true), 2200);

    const onScroll = () => {
      const threshold = isHome ? window.innerHeight * 0.72 : 24;
      setIsScrolled(window.scrollY > threshold);
    };
    onScroll();
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
  }, [isHome]);

  useEffect(() => {
    if (!overlayRef.current) return;
    document.body.style.overflow = isOpen ? "hidden" : "";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(overlayRef.current, {
        clipPath: isOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        pointerEvents: isOpen ? "auto" : "none",
      });
      return;
    }

    gsap.to(overlayRef.current, {
      clipPath: isOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      duration: 0.85,
      ease: "expo.inOut",
      pointerEvents: isOpen ? "auto" : "none",
    });

    if (isOpen) {
      const items = overlayRef.current.querySelectorAll("[data-menu-reveal]");
      const aside = overlayRef.current.querySelector("[data-menu-aside]");
      gsap.fromTo(
        items,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.85,
          stagger: 0.055,
          delay: 0.2,
          ease: "expo.out",
        }
      );
      if (aside) {
        gsap.fromTo(
          aside,
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            delay: 0.35,
            ease: "expo.out",
          }
        );
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const useLightSurface = (!isHome || isScrolled) && !isOpen;
  const isBarRevealed = !isHome || hasRevealed;

  return (
    <>
      <header
        className={`${styles.header} ${useLightSurface ? styles.lightBar : ""} ${
          isScrolled ? styles.scrolled : ""
        } ${isOpen ? styles.menuOpen : ""} ${isBarRevealed ? styles.revealed : ""}`}
      >
        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="primary-navigation-overlay"
        >
          <span className={styles.hamburger} aria-hidden="true">
            <span />
            <span />
          </span>
          <span>{isOpen ? "Close" : "Menu"}</span>
        </button>

        <Link
          href="/"
          className={styles.brand}
          onClick={() => setIsOpen(false)}
        >
          <span className={styles.logoFrame}>
            <Image
              src="/images/logo.png"
              alt="Yatra Zenith"
              width={32}
              height={32}
              priority
              className={styles.logoImg}
            />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Yatra Zenith</span>
            <span className={styles.brandSub}>Journeys Above the Ordinary</span>
          </span>
        </Link>

        <div className={styles.actions}>
          <Link
            href="/menu"
            className={`${styles.navTextLink} ${pathname === "/menu" ? styles.navTextLinkActive : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Menu
          </Link>
          <Link
            href="/#plan"
            className={styles.cta}
            onClick={() => setIsOpen(false)}
          >
            <span className={styles.ctaLong}>Plan Journey</span>
            <span className={styles.ctaShort}>Plan</span>
          </Link>
        </div>
      </header>

      <nav
        ref={overlayRef}
        id="primary-navigation-overlay"
        className={styles.overlay}
        aria-label="Primary Navigation"
        aria-hidden={!isOpen}
      >
        <div className={styles.overlayInner}>
          <div className={styles.overlayGrid}>
            <ul className={styles.navList}>
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/menu"
                    ? pathname === "/menu"
                    : item.href === "/contact"
                    ? pathname === "/contact"
                    : false;

                return (
                  <li key={item.num} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={styles.navMask}>
                        <span className={styles.navRow} data-menu-reveal>
                          <span className={styles.navNum}>{item.num}</span>
                          <span className={styles.navLabel}>{item.label}</span>
                          <span className={styles.navNote}>{item.note}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <aside className={styles.overlayAside} data-menu-aside>
              <div className={styles.asideCard}>
                <span className={styles.asideEyebrow}>Curated Archive</span>
                <h3 className={styles.asideTitle}>
                  Explore Sanctuaries, Guided Traverses &amp; Alpine Table
                </h3>
                <p className={styles.asideCopy}>
                  Browse our complete seasonal menu of private Himalayan estates,
                  naturalist-led expeditions, and thermal restoration rituals.
                </p>
                <Link
                  href="/menu"
                  className={styles.asideLink}
                  onClick={() => setIsOpen(false)}
                >
                  <span>Open Experiences Menu</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className={styles.asideMeta}>
                <div>
                  <span className={styles.asideMetaLabel}>Regions</span>
                  <p>Garhwal · Ladakh · Spiti</p>
                </div>
                <div>
                  <span className={styles.asideMetaLabel}>Atelier Hours</span>
                  <p>{istTime || "—"} IST · Mon–Sat</p>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.overlayFooter}>
            <span>Dehradun &amp; Leh Atelier · {istTime || "—"} IST</span>
            <div className={styles.footerLinks}>
              {contactLinks.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  onClick={() => setIsOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
              {socialLinks.map((s) =>
                s.href.startsWith("http") ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label}
                  </a>
                ) : (
                  <Link
                    key={s.label}
                    href={s.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {s.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

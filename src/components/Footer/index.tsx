"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "@/ui/Rounded";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [istTime, setIstTime] = useState("");
  const [year, setYear] = useState<number>(2026);

  const footerRef = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLHeadingElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setYear(now.getFullYear());
      setIstTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now)
      );
    };
    updateClock();
    const id = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        "[data-footer-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.05,
          stagger: 0.1,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: footer,
            start: "top 86%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-footer-col]",
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-footer-columns]",
            start: "top 88%",
            once: true,
          },
        }
      );

      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          { yPercent: 22, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.15,
            ease: "expo.out",
            scrollTrigger: {
              trigger: wordmarkRef.current,
              start: "top 95%",
              once: true,
            },
          }
        );
      }

      let isCancelled = false;
      let fontCtx: gsap.Context | null = null;
      let leadSplit: SplitText | null = null;

      document.fonts.ready.then(() => {
        if (isCancelled || !leadRef.current) return;

        fontCtx = gsap.context(() => {
          leadSplit = SplitText.create(leadRef.current!, {
            type: "lines",
            mask: "lines",
            linesClass: styles.splitLine,
          });

          if (leadSplit.masks.length > 0) {
            gsap.set(leadSplit.masks, {
              paddingTop: "0.16em",
              paddingBottom: "0.2em",
              marginTop: "-0.16em",
              marginBottom: "-0.2em",
              paddingInline: "0.1em",
              marginInline: "-0.1em",
            });
          }

          gsap.fromTo(
            leadSplit.lines,
            { yPercent: 112 },
            {
              yPercent: 0,
              duration: 1.1,
              stagger: 0.09,
              ease: "expo.out",
              onComplete: () => {
                leadSplit?.revert();
              },
              scrollTrigger: {
                trigger: leadRef.current,
                start: "top 88%",
                once: true,
              },
            }
          );
        }, footer);
      });

      return () => {
        isCancelled = true;
        leadSplit?.revert();
        fontCtx?.revert();
      };
    },
    { scope: footerRef }
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage("Welcome to The Seasonal Dispatch.");
    setEmail("");
  };

  return (
    <footer ref={footerRef} id="footer" className={styles.footer}>
      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.statusRow}>
          <span className={styles.statusItem}>
            <span className={styles.statusDot} aria-hidden="true" />
            Private Himalayan Atelier · Accepting Inquiries
          </span>
          <span className={styles.statusTime}>
            Dehradun &amp; Leh · {istTime || "—"} IST
          </span>
        </div>

        <div className={styles.rule} data-footer-rule aria-hidden="true" />

        <div className={styles.top}>
          <div className={styles.leadCol}>
            <h2 ref={leadRef} className={styles.lead}>
              Let the mountains set the <em>tempo</em> of your next chapter.
            </h2>

            <div className={styles.ctaWrap}>
              <Rounded className={styles.ctaBtn} backgroundColor="#c49a6c">
                <Link href="/#plan" className={styles.ctaLink}>
                  <span>Begin a Private Brief</span>
                  <span className={styles.ctaArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </Rounded>
            </div>
          </div>

          <form
            className={styles.newsletter}
            onSubmit={handleSubscribe}
            noValidate
          >
            <div className={styles.newsletterHead}>
              <span className={styles.label}>The Seasonal Dispatch</span>
              <p className={styles.newsletterCopy}>
                Quarterly field notes, sanctuary openings, and private high-pass
                windows across Garhwal, Ladakh, and Spiti.
              </p>
            </div>

            <div className={styles.inputWrap}>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address for The Seasonal Dispatch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe →</button>
            </div>
            {message && <span className={styles.msg}>{message}</span>}
          </form>
        </div>

        <div className={styles.rule} data-footer-rule aria-hidden="true" />

        <div className={styles.columns} data-footer-columns>
          <div data-footer-col>
            <div className={styles.colTitle}>01 / Navigation</div>
            <ul className={styles.list}>
              <li>
                <Link href="/#top">Sanctuary</Link>
              </li>
              <li>
                <Link href="/#philosophy">Philosophy</Link>
              </li>
              <li>
                <Link href="/#expeditions">Sanctuaries</Link>
              </li>
              <li>
                <Link href="/menu">Curated Menu</Link>
              </li>
              <li>
                <Link href="/#plan">Plan Journey</Link>
              </li>
            </ul>
          </div>

          <div data-footer-col>
            <div className={styles.colTitle}>02 / Regions</div>
            <ul className={styles.list}>
              <li>
                <Link href="/#expeditions">Garhwal Himalayas</Link>
              </li>
              <li>
                <Link href="/#expeditions">Ladakh &amp; Indus Valley</Link>
              </li>
              <li>
                <Link href="/#expeditions">Spiti High Desert</Link>
              </li>
              <li>
                <Link href="/menu">Full Experiences Menu</Link>
              </li>
            </ul>
          </div>

          <div data-footer-col>
            <div className={styles.colTitle}>03 / Himalayan Atelier</div>
            <ul className={styles.list}>
              <li>Rajpur Road, Dehradun</li>
              <li>Uttarakhand, India</li>
              <li className={styles.monoItem}>30.0668° N · 79.0193° E</li>
              <li className={styles.monoItem}>
                Local Time: {istTime || "—"} IST
              </li>
            </ul>
          </div>

          <div data-footer-col>
            <div className={styles.colTitle}>04 / Concierge</div>
            <ul className={styles.list}>
              <li>
                <a href="mailto:concierge@yatrazenith.com">
                  concierge@yatrazenith.com
                </a>
              </li>
              <li>
                <Link href="/contact">Private Consultation</Link>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.rule} data-footer-rule aria-hidden="true" />

        <div className={styles.brandBand}>
          <div className={styles.crestDivider} aria-hidden="true">
            <span />
            <svg
              width="28"
              height="18"
              viewBox="0 0 28 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.crestIcon}
            >
              <path
                d="M2 16L9.5 4.5L14.5 11.5L18.5 6.5L26 16H2Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx="14" cy="2.5" r="1.3" fill="currentColor" />
            </svg>
            <span />
          </div>

          <div ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">
            Yatra Zenith
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {year} Yatra Zenith · Luxury Retreat &amp; Expeditions
          </span>
          <span className={styles.bottomCenter}>
            Crafted for Unhurried Altitude
          </span>
          <Link href="/#top" className={styles.backTop}>
            Back to Top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}

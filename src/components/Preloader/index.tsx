"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

declare global {
  interface Window {
    __yatraPreloaderDone?: boolean;
  }
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
      () => {
        const container = containerRef.current;
        if (!container) return;

        let isCancelled = false;
        let titleSplit: SplitText | null = null;
        let tl: gsap.core.Timeline | null = null;

        window.__yatraPreloaderDone = false;
        document.body.style.overflow = "hidden";

        const notifyReveal = () => {
          window.__yatraPreloaderDone = true;
          window.dispatchEvent(new CustomEvent("reveal-header"));
          window.dispatchEvent(new CustomEvent("preloader-exit"));
        };

        const finish = () => {
          document.body.style.overflow = "";
          ScrollTrigger.refresh();
          if (!isCancelled) setDone(true);
        };

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
          notifyReveal();
          finish();
          return;
        }

        const startAnimation = () => {
          if (isCancelled || !titleRef.current) return;

          titleSplit = SplitText.create(titleRef.current, {
            type: "chars",
            mask: "chars",
          });

          const counter = { value: 0 };

          const updateCounter = () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                  Math.round(counter.value)
              ).padStart(2, "0");
            }
          };

          gsap.set(titleRef.current, { autoAlpha: 1 });

          tl = gsap.timeline({ onComplete: finish });

          // 1. Editorial entrance
          tl.fromTo(
              "[data-pre-meta]",
              { y: 14, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" },
              0
          )
              .fromTo(
                  logoRef.current,
                  { scale: 0.86, autoAlpha: 0 },
                  { scale: 1, autoAlpha: 1, duration: 0.9, ease: "expo.out" },
                  0.05
              )
              .fromTo(
                  subtitleRef.current,
                  { y: 12, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" },
                  0.15
              )
              .fromTo(
                  titleSplit.chars,
                  { yPercent: 115 },
                  {
                    yPercent: 0,
                    duration: 0.95,
                    stagger: 0.025,
                    ease: "expo.out",
                  },
                  0.18
              )

              // 2. Two-beat organic loading pace (0 -> 72 -> 100)
              .to(
                  counter,
                  {
                    value: 72,
                    duration: 1.05,
                    ease: "power2.out",
                    onUpdate: updateCounter,
                  },
                  0.25
              )
              .to(
                  barFillRef.current,
                  {
                    scaleX: 0.72,
                    duration: 1.05,
                    ease: "power2.out",
                  },
                  0.25
              )
              .to(
                  counter,
                  {
                    value: 100,
                    duration: 0.65,
                    ease: "expo.inOut",
                    onUpdate: updateCounter,
                  },
                  "+=0.08"
              )
              .to(
                  barFillRef.current,
                  {
                    scaleX: 1,
                    duration: 0.65,
                    ease: "expo.inOut",
                  },
                  "<"
              )

              // 3. Content lifts away, then curtain wipes up with subtle inner counter-shift
              .to(
                  [
                    logoRef.current,
                    subtitleRef.current,
                    titleRef.current,
                    "[data-pre-track]",
                    "[data-pre-meta]",
                  ],
                  {
                    y: -26,
                    autoAlpha: 0,
                    duration: 0.55,
                    stagger: 0.03,
                    ease: "power3.in",
                  },
                  "+=0.12"
              )
              .add(notifyReveal, "-=0.22")
              .to(
                  container,
                  {
                    clipPath: "inset(0% 0% 100% 0%)",
                    duration: 1.15,
                    ease: "expo.inOut",
                  },
                  "-=0.15"
              )
              .to(
                  innerRef.current,
                  {
                    yPercent: -8,
                    duration: 1.15,
                    ease: "expo.inOut",
                  },
                  "<"
              );
        };

        document.fonts.ready.then(startAnimation);

        return () => {
          isCancelled = true;
          tl?.kill();
          titleSplit?.revert();
          document.body.style.overflow = "";
        };
      },
      { scope: containerRef }
  );

  if (done) return null;

  return (
      <div
          ref={containerRef}
          className={styles.preloader}
          role="status"
          aria-label="Loading Yatra Zenith"
      >
        <div className={styles.ambientGlow} aria-hidden="true" />

        <div ref={innerRef} className={styles.inner}>
          <div className={styles.metaBar} data-pre-meta>
            <span>30.0668° N · 79.0193° E</span>
            <span>{tagline}</span>
          </div>

          <div className={styles.center}>
            <div ref={logoRef} className={styles.logoWrap}>
              <Image
                  src="/images/logo.png"
                  alt="Yatra Zenith"
                  width={84}
                  height={84}
                  className={styles.logo}
                  priority
              />
            </div>

            <span ref={subtitleRef} className={styles.subtitle}>
            {subtitle}
          </span>

            <h1 ref={titleRef} className={styles.title}>
              {title}
            </h1>

            <div className={styles.barTrack} data-pre-track>
              <div ref={barFillRef} className={styles.barFill} />
            </div>
          </div>

          <div className={styles.metaBar} data-pre-meta>
            <span>Curated Expeditions</span>
            <div className={styles.counterWrap}>
            <span ref={counterRef} className={styles.counter}>
              00
            </span>
              <span className={styles.counterUnit}>%</span>
            </div>
          </div>
        </div>
      </div>
  );
}
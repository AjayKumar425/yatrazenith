"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, SplitText);

export default function Landing() {
  const containerRef = useRef<HTMLElement>(null);
  const landingPageRef = useRef<HTMLDivElement>(null);
  const backgroundMediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const preloaderRef = useRef<HTMLDivElement>(null);
  const preloaderScreenRef = useRef<HTMLDivElement>(null);
  const preloaderLogoRef = useRef<HTMLDivElement>(null);

  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroEyebrowRef = useRef<HTMLParagraphElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const splitsRef = useRef<SplitText[]>([]);

  const getClipCoordinates = useCallback(() => {
    if (typeof window === "undefined") {
      return {
        initialClip: "polygon(38% 42%, 62% 42%, 62% 100%, 38% 100%)",
        logoTop: "26%",
      };
    }
    const width = window.innerWidth;
    let offset = 12; 
    let offsetTop = "42%";
    let logoTop = "26%";

    if (width < 1024) {
      offset = 18; 
      offsetTop = "44%";
      logoTop = "28%";
    }
    if (width < 768) {
      offset = 27; 
      offsetTop = "42%";
      logoTop = "26%";
    }
    if (width < 480) {
      offset = 35; 
      offsetTop = "40%";
      logoTop = "24%";
    }

    const offsetPositive = `${50 - offset}%`;
    const offsetNegative = `${50 + offset}%`;

    return {
      initialClip: `polygon(${offsetPositive} ${offsetTop}, ${offsetNegative} ${offsetTop}, ${offsetNegative} 100%, ${offsetPositive} 100%)`,
      logoTop,
    };
  }, []);

  // Ensure video plays smoothly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay handled safely
      });
    }
  }, []);

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

  // The Signature Mask Reveal Animation with GSAP SplitText
  const runRevealAnimation = useCallback(() => {
    if (
      !landingPageRef.current ||
      !preloaderLogoRef.current ||
      !preloaderScreenRef.current ||
      !heroTitleRef.current ||
      !heroEyebrowRef.current
    ) {
      return;
    }

    const { initialClip, logoTop } = getClipCoordinates();

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    cleanupSplits();

    // Initial Preloader State
    gsap.set(preloaderRef.current, { display: "block", autoAlpha: 1 });
    gsap.set(preloaderScreenRef.current, { autoAlpha: 1 });
    gsap.set(preloaderLogoRef.current, {
      top: "50%",
      left: "50%",
      opacity: 1,
      yPercent: -50,
      xPercent: -50,
      scale: 1,
    });

    // video section
    gsap.set(landingPageRef.current, {
      clipPath: initialClip,
      y: "100%",
    });
    gsap.set(backgroundMediaRef.current, {
      scale: 1.15,
    });

    // GSAP SplitText
    const eyebrowParent = new SplitText(heroEyebrowRef.current, {
      type: "lines",
      linesClass: styles.lineMask,
    });
    const eyebrowChild = new SplitText(eyebrowParent.lines, {
      type: "lines",
      linesClass: styles.lineInner,
    });

    const titleParent = new SplitText(heroTitleRef.current, {
      type: "lines",
      linesClass: styles.lineMask,
    });
    const titleChild = new SplitText(titleParent.lines, {
      type: "lines",
      linesClass: styles.lineInner,
    });

    splitsRef.current = [eyebrowParent, eyebrowChild, titleParent, titleChild];

    // Initial state of text inside their line masks
    gsap.set([eyebrowChild.lines, titleChild.lines], {
      yPercent: 120,
      opacity: 0,
    });

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        if (landingPageRef.current) {
          gsap.set(landingPageRef.current, {
            clipPath: "none",
            clearProps: "y,transform",
          });
        }
        if (preloaderRef.current) {
          gsap.set(preloaderRef.current, { display: "none" });
        }
      },
    });

    timelineRef.current = tl;

    tl.to(
      landingPageRef.current,
      {
        y: "0%",
        duration: 1.85,
        ease: "expo.inOut",
      },
      0
    );

    tl.to(
      preloaderLogoRef.current,
      {
        top: logoTop,
        duration: 1.85,
        ease: "expo.inOut",
      },
      0
    );

    // Mask
    tl.to(
      landingPageRef.current,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 2.0,
        ease: "expo.inOut",
      },
      1.75
    );

    // Parallax
    tl.to(
      backgroundMediaRef.current,
      {
        scale: 1.0,
        duration: 2.0,
        ease: "expo.inOut",
      },
      1.75
    );

    // Logo Move
    tl.to(
      preloaderLogoRef.current,
      {
        top: "6%",
        opacity: 0,
        scale: 0.95,
        duration: 1.0,
        ease: "expo.inOut",
      },
      1.75
    );

    // Video Fill/Mask
    tl.to(
      preloaderScreenRef.current,
      {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      2.6
    );

    tl.call(() => {
      window.dispatchEvent(new CustomEvent("reveal-header"));
    }, undefined, 2.15);

    tl.to(
      eyebrowChild.lines,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        ease: "expo.out",
      },
      2.3
    );

    tl.to(
      titleChild.lines,
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.6,
        stagger: 0.12,
        ease: "expo.out",
      },
      2.4
    );
  }, [getClipCoordinates, cleanupSplits]);

  useGSAP(
    () => {
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          runRevealAnimation();
        });
      } else {
        runRevealAnimation();
      }
    },
    { scope: containerRef }
  );

  return (
    <main className={styles.landing} ref={containerRef}>
      <div className={styles.preloader} ref={preloaderRef}>
        <div className={styles.preloaderScreen} ref={preloaderScreenRef} />
        <div className={styles.preloaderLogo} ref={preloaderLogoRef}>
          <div className={styles.preloaderLogoInner}>
            <Image
              src="/images/logo.png"
              alt="Yatra Zenith"
              width={104}
              height={104}
              priority
              className={styles.logoImage}
            />
            <div className={styles.wordmark}>
              <span className={styles.wordmarkThe}>The</span>
              <h2 className={styles.wordmarkTitle}>Yatra Zenith</h2>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.landingPage} ref={landingPageRef}>
        <div className={styles.backgroundMedia} ref={backgroundMediaRef}>
          <video
            ref={videoRef}
            src="/video/intro.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={styles.video}
          />
          <div className={styles.overlayGradient} />
          <div className={styles.overlayVignette} />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroContent} ref={heroContentRef}>
            <p className={styles.heroEyebrow} ref={heroEyebrowRef}>
              Expeditions & Retreat — Himalayas
            </p>

            <h1 className={styles.heroTitle} ref={heroTitleRef}>
              Find the spirit of the Himalayas
              <br />
              at Yatra Zenith
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "@/ui/Rounded";
import MaskReveal from "@/ui/MaskReveal";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export interface DescriptionProps {
  eyebrow?: string;
  coordinates?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function Description({
  eyebrow = "01 / Philosophy",
  coordinates = "Garhwal & Kumaon · 1,400M — 4,800M",
  imageSrc = "/images/sanctuary-terrace.jpg",
  imageAlt = "Quiet Himalayan stone sanctuary overlooking misty mountain ridges",
  ctaLabel = "Our Approach",
  ctaHref = "#plan",
}: DescriptionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const topRuleRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const copyWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      let isCancelled = false;
      let fontCtx: gsap.Context | null = null;
      let manifestoSplit: SplitText | null = null;
      let bodySplit: SplitText | null = null;

      if (topRuleRef.current) {
        gsap.fromTo(
          topRuleRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.0,
            ease: "expo.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
              once: true,
            },
          }
        );
      }

      if (frameRef.current && imageWrapRef.current) {
        gsap.fromTo(
          frameRef.current,
          { clipPath: "inset(14% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          imageWrapRef.current,
          { yPercent: -8, scale: 1.08 },
          {
            yPercent: 8,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 18, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      document.fonts.ready.then(() => {
        if (isCancelled || !manifestoRef.current || !copyWrapRef.current) {
          return;
        }

        fontCtx = gsap.context(() => {
          manifestoSplit = SplitText.create(manifestoRef.current!, {
            type: "words",
          });

          gsap.fromTo(
            manifestoSplit.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.04,
              ease: "none",
              scrollTrigger: {
                trigger: manifestoRef.current,
                start: "top 82%",
                end: "bottom 52%",
                scrub: 0.5,
              },
            }
          );

          const paragraphs = copyWrapRef.current!.querySelectorAll("p");
          bodySplit = SplitText.create(paragraphs, {
            type: "lines",
            mask: "lines",
            linesClass: styles.splitLine,
          });

          if (bodySplit.masks.length > 0) {
            gsap.set(bodySplit.masks, {
              paddingTop: "0.14em",
              paddingBottom: "0.18em",
              marginTop: "-0.14em",
              marginBottom: "-0.18em",
              paddingInline: "0.06em",
              marginInline: "-0.06em",
            });
          }

          gsap.fromTo(
            bodySplit.lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.05,
              stagger: 0.055,
              ease: "expo.out",
              onComplete: () => {
                bodySplit?.revert();
              },
              scrollTrigger: {
                trigger: copyWrapRef.current,
                start: "top 84%",
                once: true,
              },
            }
          );
        }, section);

        ScrollTrigger.refresh();
      });

      return () => {
        isCancelled = true;
        manifestoSplit?.revert();
        bodySplit?.revert();
        fontCtx?.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className={styles.description}
      aria-labelledby="philosophy-heading"
    >
      <div className={styles.inner}>
        <div className={styles.metaRow}>
          <MaskReveal className={styles.eyebrow}>{eyebrow}</MaskReveal>
          <MaskReveal delay={0.08} className={styles.coords}>
            {coordinates}
          </MaskReveal>
        </div>
        <div ref={topRuleRef} className={styles.topRule} aria-hidden="true" />

        <h2
          ref={manifestoRef}
          id="philosophy-heading"
          className={styles.manifesto}
        >
          We craft unhurried passage into the <em>quietest valleys</em> of the
          Himalayas — where ancient stone trails, high-altitude silence, and{" "}
          <em>architectural sanctuaries</em> meet.
        </h2>

        <div className={styles.grid}>
          <figure className={styles.mediaCol}>
            <div ref={frameRef} className={styles.imageFrame}>
              <div ref={imageWrapRef} className={styles.imageWrap}>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 44vw"
                  className={styles.image}
                />
              </div>
            </div>
            <figcaption className={styles.caption}>
              <span>Fig. 01 — High-Altitude Stone &amp; Cedar Retreat</span>
              <span>30.48° N · 79.21° E</span>
            </figcaption>
          </figure>

          <div className={styles.contentCol}>
            <div ref={copyWrapRef} className={styles.copy}>
              <p>
                Every journey begins with stillness and intent. Rather than
                rushed checklists, our private travel atelier pairs lifelong
                mountain naturalists with design-led retreats tucked far beyond
                familiar routes.
              </p>
              <p>
                From first-light tea facing snow-crowned massifs to ridge-line
                traverses and fireside restoration, each passage is composed
                around your pace — never the crowd&apos;s.
              </p>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>14+</span>
                <span className={styles.statLabel}>Private Sanctuaries</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>4,800M</span>
                <span className={styles.statLabel}>Peak Elevation</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>100%</span>
                <span className={styles.statLabel}>Bespoke Passage</span>
              </div>
            </div>

            <div ref={ctaRef} className={styles.ctaWrap}>
              <Rounded className={styles.ctaBtn} backgroundColor="#141414">
                <Link href={ctaHref} className={styles.ctaLink}>
                  <span>{ctaLabel}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </Rounded>
              <Link href="/menu" className={styles.secondaryLink}>
                <span>Browse Experiences Menu</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

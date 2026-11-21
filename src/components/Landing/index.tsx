"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "@/ui/Rounded";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Landing() {
    const heroRef = useRef<HTMLElement>(null);
    const mediaInnerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const leadRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const scrollCueRef = useRef<HTMLDivElement>(null);
    const scrollLineRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const hero = heroRef.current;
            if (!hero) return;

            let isCancelled = false;
            let hasPlayed = false;
            let titleSplit: SplitText | null = null;
            let leadSplit: SplitText | null = null;
            let revealTl: gsap.core.Timeline | null = null;
            let scrollPulseTl: gsap.core.Timeline | null = null;

            // 1. Multi-layer scrubbed parallax
            const mm = gsap.matchMedia();

            mm.add(
                {
                    isDesktop:
                        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
                    isMobile:
                        "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
                },
                (context) => {
                    const { isDesktop } = context.conditions ?? {};

                    gsap.fromTo(
                        mediaInnerRef.current,
                        { yPercent: 0, scale: 1 },
                        {
                            yPercent: isDesktop ? 10 : 6,
                            scale: isDesktop ? 1.05 : 1.03,
                            ease: "none",
                            scrollTrigger: {
                                trigger: hero,
                                start: "top top",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );

                    gsap.to(innerRef.current, {
                        yPercent: isDesktop ? -10 : -5,
                        opacity: 0.18,
                        ease: "none",
                        scrollTrigger: {
                            trigger: hero,
                            start: "top top",
                            end: "bottom top",
                            scrub: true,
                        },
                    });

                    if (scrollCueRef.current) {
                        gsap.to(scrollCueRef.current, {
                            y: -16,
                            autoAlpha: 0,
                            ease: "none",
                            scrollTrigger: {
                                trigger: hero,
                                start: "top top",
                                end: "20% top",
                                scrub: true,
                            },
                        });
                    }
                }
            );

            // 2. Initial states
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (prefersReducedMotion) {
                gsap.set(
                    [
                        metaRef.current,
                        titleRef.current,
                        leadRef.current,
                        buttonsRef.current,
                        scrollCueRef.current,
                    ],
                    { autoAlpha: 1 }
                );
                gsap.set(dividerRef.current, { scaleX: 1 });
                return () => mm.revert();
            }

            gsap.set(videoRef.current, { scale: 1.12 });
            gsap.set(
                [
                    metaRef.current,
                    titleRef.current,
                    leadRef.current,
                    buttonsRef.current,
                    scrollCueRef.current,
                ],
                { autoAlpha: 0 }
            );
            gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });

            // 3. Synchronized SplitText & cinema reveal
            const playReveal = () => {
                if (isCancelled || hasPlayed || !titleRef.current || !leadRef.current) {
                    return;
                }
                hasPlayed = true;

                titleSplit = SplitText.create(titleRef.current, {
                    type: "lines,words",
                    mask: "lines",
                    linesClass: styles.splitLine,
                });

                leadSplit = SplitText.create(leadRef.current, {
                    type: "lines",
                    mask: "lines",
                    linesClass: styles.splitLine,
                });

                gsap.set([titleRef.current, leadRef.current], { autoAlpha: 1 });

                revealTl = gsap.timeline({ defaults: { ease: "expo.out" } });

                revealTl
                    .to(
                        videoRef.current,
                        {
                            scale: 1,
                            duration: 1.9,
                            ease: "power3.out",
                        },
                        0
                    )
                    .fromTo(
                        metaRef.current,
                        { y: 16, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 1.0 },
                        0.18
                    )
                    .fromTo(
                        titleSplit.lines,
                        { yPercent: 112, rotate: 1.1 },
                        {
                            yPercent: 0,
                            rotate: 0,
                            duration: 1.35,
                            stagger: 0.11,
                        },
                        0.22
                    )
                    .to(
                        dividerRef.current,
                        {
                            scaleX: 1,
                            duration: 1.15,
                            ease: "expo.inOut",
                        },
                        0.4
                    )
                    .fromTo(
                        leadSplit.lines,
                        { yPercent: 110 },
                        {
                            yPercent: 0,
                            duration: 1.05,
                            stagger: 0.06,
                        },
                        0.5
                    )
                    .fromTo(
                        buttonsRef.current,
                        { y: 20, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 1.0 },
                        0.58
                    )
                    .fromTo(
                        scrollCueRef.current,
                        { y: 12, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 0.9 },
                        0.7
                    );

                if (scrollLineRef.current) {
                    scrollPulseTl = gsap.timeline({ repeat: -1, delay: 1.1 });
                    scrollPulseTl
                        .fromTo(
                            scrollLineRef.current,
                            { scaleY: 0, transformOrigin: "top center" },
                            { scaleY: 1, duration: 0.95, ease: "expo.inOut" }
                        )
                        .to(scrollLineRef.current, {
                            scaleY: 0,
                            transformOrigin: "bottom center",
                            duration: 0.95,
                            ease: "expo.inOut",
                            delay: 0.35,
                        });
                }
            };

            const triggerWhenFontsReady = () => {
                document.fonts.ready.then(playReveal);
            };

            let fallbackTimer: number | undefined;

            if (window.__yatraPreloaderDone) {
                triggerWhenFontsReady();
            } else {
                window.addEventListener("preloader-exit", triggerWhenFontsReady, {
                    once: true,
                });
                fallbackTimer = window.setTimeout(triggerWhenFontsReady, 2800);
            }

            return () => {
                isCancelled = true;
                if (fallbackTimer) window.clearTimeout(fallbackTimer);
                window.removeEventListener("preloader-exit", triggerWhenFontsReady);
                revealTl?.kill();
                scrollPulseTl?.kill();
                titleSplit?.revert();
                leadSplit?.revert();
                mm.revert();
            };
        },
        { scope: heroRef }
    );

    return (
        <section ref={heroRef} id="top" className={styles.hero}>
            <div className={styles.media} aria-hidden="true">
                <div ref={mediaInnerRef} className={styles.mediaInner}>
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
                </div>
            </div>

            <div className={styles.vignette} aria-hidden="true" />

            <div ref={innerRef} className={styles.inner}>
                <div ref={metaRef} className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaDot} aria-hidden="true" />
            Expeditions &amp; Retreat — Himalayas
          </span>
                    <span>Private Travel Atelier · Uttarakhand</span>
                </div>

                <h1 ref={titleRef} className={styles.title}>
                    Journeys Above <em>the Ordinary</em>
                </h1>

                <div ref={dividerRef} className={styles.divider} aria-hidden="true" />

                <div className={styles.bottom}>
                    <p ref={leadRef} className={styles.lead}>
                        Find the spirit of the Himalayas through privately curated
                        expeditions, architectural mountain sanctuaries, and unhurried
                        passage across India&apos;s highest valleys.
                    </p>

                    <div ref={buttonsRef} className={styles.buttons}>
                        <Rounded className={styles.btnPrimary} backgroundColor="#c49a6c">
                            <Link href="#expeditions" className={styles.btnLink}>
                                <span>Explore Expeditions</span>
                                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
                            </Link>
                        </Rounded>

                        <Rounded className={styles.btnGhost} backgroundColor="#f8f6f4">
                            <Link href="#plan" className={styles.btnLink}>
                                <span>Private Brief</span>
                            </Link>
                        </Rounded>
                    </div>

                    <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
                        <span>Scroll</span>
                        <div className={styles.scrollTrack}>
                            <div ref={scrollLineRef} className={styles.scrollLine} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
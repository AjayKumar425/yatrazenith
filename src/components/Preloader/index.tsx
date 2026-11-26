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

const BLOCKED_SCROLL_KEYS = new Set([
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Space",
    "Home",
    "End",
]);

export default function Preloader({
                                      title = "Yatra Zenith",
                                      subtitle = "Private Travel Atelier",
                                      tagline = "Himalayan Sanctuary",
                                  }: PreloaderProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const veilRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const crestRef = useRef<HTMLDivElement>(null);
    const ringCircleRef = useRef<SVGCircleElement>(null);
    const subtitleRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const captionRef = useRef<HTMLSpanElement>(null);
    const barFillRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const altitudeRef = useRef<HTMLSpanElement>(null);
    const [done, setDone] = useState(false);

    const words = title.trim().split(/\s+/);
    const emphasisWord = words.length > 1 ? words.pop() : null;
    const primaryWords = words.join(" ");

    useGSAP(
        () => {
            const panel = panelRef.current;
            const veil = veilRef.current;
            if (!panel || !veil) return;

            let isCancelled = false;
            let titleSplit: SplitText | null = null;
            let tl: gsap.core.Timeline | null = null;

            const hash = window.location.hash;
            const alreadySeen = window.__yatraPreloaderDone === true;

            const notifyReveal = () => {
                window.__yatraPreloaderDone = true;
                window.dispatchEvent(new CustomEvent("reveal-header"));
                window.dispatchEvent(new CustomEvent("preloader-exit"));
            };

            if (hash || alreadySeen) {
                notifyReveal();
                ScrollTrigger.refresh();
                setDone(true);
                if (hash) {
                    const targetId = hash.slice(1);
                    window.requestAnimationFrame(() => {
                        document
                            .getElementById(targetId)
                            ?.scrollIntoView({ behavior: "smooth" });
                    });
                }
                return;
            }

            window.__yatraPreloaderDone = false;
            window.scrollTo(0, 0);

            // Lock scroll without modifying body overflow (prevents scrollbar jump)
            const preventWheelOrTouch = (e: Event) => {
                e.preventDefault();
            };

            const preventScrollKeys = (e: KeyboardEvent) => {
                if (BLOCKED_SCROLL_KEYS.has(e.code)) {
                    e.preventDefault();
                }
            };

            const unlockScroll = () => {
                window.removeEventListener("wheel", preventWheelOrTouch);
                window.removeEventListener("touchmove", preventWheelOrTouch);
                window.removeEventListener("keydown", preventScrollKeys);
            };

            window.addEventListener("wheel", preventWheelOrTouch, { passive: false });
            window.addEventListener("touchmove", preventWheelOrTouch, {
                passive: false,
            });
            window.addEventListener("keydown", preventScrollKeys);

            const finish = () => {
                unlockScroll();
                ScrollTrigger.refresh();
                if (!isCancelled) setDone(true);
            };

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (prefersReducedMotion) {
                notifyReveal();
                finish();
                return () => unlockScroll();
            }

            const startAnimation = () => {
                if (isCancelled || !titleRef.current) return;

                titleSplit = SplitText.create(titleRef.current, {
                    type: "lines,chars",
                    mask: "lines",
                    linesClass: styles.splitLine,
                });

                if (titleSplit.masks.length > 0) {
                    gsap.set(titleSplit.masks, {
                        paddingTop: "0.14em",
                        paddingBottom: "0.18em",
                        marginTop: "-0.14em",
                        marginBottom: "-0.18em",
                        paddingInline: "0.08em",
                        marginInline: "-0.08em",
                    });
                }

                const ring = ringCircleRef.current;
                const ringLength = ring ? ring.getTotalLength() : 220;
                if (ring) {
                    gsap.set(ring, {
                        strokeDasharray: ringLength,
                        strokeDashoffset: ringLength,
                    });
                }

                const state = { progress: 0 };

                const updateReadouts = () => {
                    const pct = Math.round(state.progress);
                    if (counterRef.current) {
                        counterRef.current.textContent = String(pct).padStart(2, "0");
                    }
                    if (altitudeRef.current) {
                        const meters = Math.round(1400 + (state.progress / 100) * 3400);
                        altitudeRef.current.textContent = `${meters.toLocaleString("en-US")}M`;
                    }
                };

                gsap.set(titleRef.current, { autoAlpha: 1 });

                tl = gsap.timeline({ onComplete: finish });

                tl.fromTo(
                    "[data-pre-rule]",
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        duration: 1.0,
                        stagger: 0.08,
                        ease: "expo.inOut",
                    },
                    0
                )
                    .fromTo(
                        "[data-pre-meta]",
                        { y: 10, autoAlpha: 0 },
                        {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.75,
                            stagger: 0.06,
                            ease: "power3.out",
                        },
                        0.08
                    )
                    .fromTo(
                        crestRef.current,
                        { scale: 0.84, autoAlpha: 0 },
                        { scale: 1, autoAlpha: 1, duration: 0.9, ease: "expo.out" },
                        0.1
                    )
                    .to(
                        ring,
                        {
                            strokeDashoffset: 0,
                            duration: 1.65,
                            ease: "power2.inOut",
                        },
                        0.15
                    )
                    .fromTo(
                        subtitleRef.current,
                        { y: 12, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" },
                        0.18
                    )
                    .fromTo(
                        titleSplit.chars,
                        { yPercent: 112 },
                        {
                            yPercent: 0,
                            duration: 1.0,
                            stagger: 0.022,
                            ease: "expo.out",
                        },
                        0.22
                    )
                    .fromTo(
                        captionRef.current,
                        { y: 10, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" },
                        0.42
                    )
                    .to(
                        state,
                        {
                            progress: 74,
                            duration: 1.05,
                            ease: "power2.out",
                            onUpdate: updateReadouts,
                        },
                        0.22
                    )
                    .to(
                        barFillRef.current,
                        {
                            scaleX: 0.74,
                            duration: 1.05,
                            ease: "power2.out",
                        },
                        0.22
                    )
                    .to(
                        state,
                        {
                            progress: 100,
                            duration: 0.65,
                            ease: "expo.inOut",
                            onUpdate: updateReadouts,
                        },
                        "+=0.06"
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
                    .to(
                        [
                            crestRef.current,
                            subtitleRef.current,
                            titleRef.current,
                            captionRef.current,
                            "[data-pre-meta]",
                        ],
                        {
                            y: -22,
                            autoAlpha: 0,
                            duration: 0.5,
                            stagger: 0.025,
                            ease: "power3.in",
                        },
                        "+=0.14"
                    )
                    .to(
                        "[data-pre-rule]",
                        {
                            scaleX: 0,
                            transformOrigin: "right center",
                            duration: 0.45,
                            ease: "power3.in",
                        },
                        "<"
                    )
                    .add(notifyReveal, "-=0.18")
                    .to(
                        panel,
                        {
                            clipPath: "inset(0% 0% 100% 0%)",
                            duration: 1.15,
                            ease: "expo.inOut",
                        },
                        "-=0.1"
                    )
                    .to(
                        innerRef.current,
                        {
                            yPercent: -6,
                            duration: 1.15,
                            ease: "expo.inOut",
                        },
                        "<"
                    )
                    .to(
                        veil,
                        {
                            clipPath: "inset(0% 0% 100% 0%)",
                            duration: 1.15,
                            ease: "expo.inOut",
                        },
                        "-=1.06"
                    );
            };

            document.fonts.ready.then(startAnimation);

            return () => {
                isCancelled = true;
                tl?.kill();
                titleSplit?.revert();
                unlockScroll();
            };
        },
        { scope: rootRef }
    );

    if (done) return null;

    return (
        <div
            ref={rootRef}
            className={styles.root}
            role="status"
            aria-label="Loading Yatra Zenith"
        >
            <div ref={veilRef} className={styles.veil} aria-hidden="true" />

            <div ref={panelRef} className={styles.panel}>
                <div className={styles.grain} aria-hidden="true" />
                <div className={styles.glow} aria-hidden="true" />

                <div ref={innerRef} className={styles.inner}>
                    <div className={styles.topSection}>
                        <div className={styles.metaBar} data-pre-meta>
                            <span>30.0668° N · 79.0193° E</span>
                            <span className={styles.centerMeta}>
                <span className={styles.dot} aria-hidden="true" />
                Uttarakhand · India
              </span>
                            <span>{tagline}</span>
                        </div>
                        <div className={styles.rule} data-pre-rule aria-hidden="true" />
                    </div>

                    <div className={styles.center}>
                        <div ref={crestRef} className={styles.crest}>
                            <svg
                                className={styles.crestRing}
                                viewBox="0 0 82 82"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="41"
                                    cy="41"
                                    r="38"
                                    className={styles.ringTrack}
                                />
                                <circle
                                    ref={ringCircleRef}
                                    cx="41"
                                    cy="41"
                                    r="38"
                                    className={styles.ringProgress}
                                />
                            </svg>
                            <div className={styles.medallion}>
                                <Image
                                    src="/images/logo.png"
                                    alt="Yatra Zenith Crest"
                                    width={60}
                                    height={60}
                                    className={styles.logo}
                                    priority
                                />
                            </div>
                        </div>

                        <span ref={subtitleRef} className={styles.subtitle}>
              {subtitle}
            </span>

                        <h1 ref={titleRef} className={styles.title}>
                            {primaryWords}
                            {emphasisWord && (
                                <>
                                    {" "}
                                    <em>{emphasisWord}</em>
                                </>
                            )}
                        </h1>

                        <span ref={captionRef} className={styles.caption}>
              Journeys Above the Ordinary
            </span>
                    </div>

                    <div className={styles.bottomSection}>
                        <div className={styles.barTrack} data-pre-rule>
                            <div ref={barFillRef} className={styles.barFill} />
                        </div>

                        <div className={styles.bottomMeta} data-pre-meta>
                            <div className={styles.bottomLeft}>
                                <span className={styles.label}>Curated Expeditions</span>
                                <span className={styles.altitude}>
                                    Elevation <strong ref={altitudeRef}>1,400M</strong>
                                </span>
                            </div>

                            <div className={styles.counterWrap}>
                <span ref={counterRef} className={styles.counter}>
                  00
                </span>
                                <span className={styles.counterUnit}>%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
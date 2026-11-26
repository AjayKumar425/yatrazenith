"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Rounded from "@/ui/Rounded";
import { readItinerary, writeItinerary } from "@/lib/itinerary";
import { SANCTUARIES } from "./data";
import { SanctuaryIcon } from "./icons";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger, Draggable, InertiaPlugin);

export interface SanctuarySelectionDetail {
  region: string;
  guests: number;
  sanctuaryTitle: string;
  nightlyRate: number;
}

export default function Sanctuaries() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const trackViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const draggableRef = useRef<Draggable | null>(null);
  const slideTweenRef = useRef<gsap.core.Tween | null>(null);
  const boundsRef = useRef<{ minX: number; baseProgress: number }>({
    minX: -480,
    baseProgress: 0.28,
  });
  const hasInteractedTabRef = useRef(false);

  const activeSanctuary = SANCTUARIES[activeIndex];

  const syncTrackState = (xValue?: number) => {
    const track = trackRef.current;
    const progressEl = progressFillRef.current;
    if (!track) return;

    const currentX =
      typeof xValue === "number"
        ? xValue
        : (gsap.getProperty(track, "x") as number) || 0;
    const { minX, baseProgress } = boundsRef.current;

    if (progressEl) {
      const ratio = minX < 0 ? Math.min(1, Math.max(0, currentX / minX)) : 1;
      const scale = baseProgress + (1 - baseProgress) * ratio;
      gsap.set(progressEl, { scaleX: scale });
    }

    setCanPrev(currentX < -4);
    setCanNext(minX < -4 && currentX > minX + 4);
  };

  // Crisp editorial sheet entrance on scroll
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(sheetRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      if (sheetRef.current) {
        gsap.fromTo(
          sheetRef.current,
          { y: 36, autoAlpha: 0.94 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.05,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              start: "top 86%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  // SplitText header reveal + Draggable horizontal card track per selected sanctuary
  useGSAP(
    () => {
      const sheet = sheetRef.current;
      const viewport = trackViewportRef.current;
      const track = trackRef.current;
      if (!sheet || !viewport || !track) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      slideTweenRef.current?.kill();
      gsap.set(track, { x: 0 });

      const computeBounds = () => {
        const viewportWidth = viewport.clientWidth;
        const trackWidth = track.scrollWidth;
        const minX = Math.min(0, viewportWidth - trackWidth);
        const baseProgress =
          trackWidth > 0 ? Math.min(1, viewportWidth / trackWidth) : 1;
        boundsRef.current = { minX, baseProgress };
        return { minX, baseProgress };
      };

      const { minX } = computeBounds();
      syncTrackState(0);

      const instances = Draggable.create(track, {
        type: "x",
        bounds: { minX, maxX: 0 },
        edgeResistance: 0.68,
        inertia: true,
        dragClickables: false,
        allowNativeTouchScrolling: true,
        onPress: () => {
          slideTweenRef.current?.kill();
        },
        onDrag: function () {
          syncTrackState(this.x);
        },
        onThrowUpdate: function () {
          syncTrackState(this.x);
        },
        onThrowComplete: function () {
          syncTrackState(this.x);
        },
        onDragEnd: function () {
          syncTrackState(this.x);
        },
      });

      draggableRef.current = instances[0] ?? null;

      const observer = new ResizeObserver(() => {
        const updated = computeBounds();
        const currentDraggable = draggableRef.current;
        if (currentDraggable) {
          currentDraggable.applyBounds({ minX: updated.minX, maxX: 0 });
          const clampedX = Math.max(
            updated.minX,
            Math.min(0, (gsap.getProperty(track, "x") as number) || 0)
          );
          gsap.set(track, { x: clampedX });
          currentDraggable.update(true);
          syncTrackState(clampedX);
        }
      });
      observer.observe(viewport);

      let isCancelled = false;
      let fontCtx: gsap.Context | null = null;
      let titleSplit: SplitText | null = null;

      if (!prefersReducedMotion) {
        const isImmediateSwitch = hasInteractedTabRef.current;
        const cards = track.querySelectorAll("[data-sanctuary-card]");
        const rules = track.querySelectorAll("[data-spec-rule]");

        const deckTl = gsap.timeline(
          isImmediateSwitch
            ? undefined
            : {
                scrollTrigger: {
                  trigger: viewport,
                  start: "top 86%",
                  once: true,
                },
              }
        );

        deckTl
          .fromTo(
            cards,
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.07,
              ease: "expo.out",
            },
            0
          )
          .fromTo(
            rules,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.85,
              stagger: 0.025,
              ease: "expo.inOut",
            },
            0.12
          );

        document.fonts.ready.then(() => {
          if (isCancelled || !titleRef.current || !headerRef.current) return;

          fontCtx = gsap.context(() => {
            titleSplit = SplitText.create(titleRef.current!, {
              type: "lines",
              mask: "lines",
              linesClass: styles.splitLine,
            });

            if (titleSplit.masks.length > 0) {
              gsap.set(titleSplit.masks, {
                paddingTop: "0.18em",
                paddingBottom: "0.22em",
                marginTop: "-0.18em",
                marginBottom: "-0.22em",
                paddingInline: "0.12em",
                marginInline: "-0.12em",
              });
            }

            const headerTl = gsap.timeline({
              ...(isImmediateSwitch
                ? {}
                : {
                    scrollTrigger: {
                      trigger: headerRef.current,
                      start: "top 84%",
                      once: true,
                    },
                  }),
              onComplete: () => {
                titleSplit?.revert();
              },
            });

            if (!isImmediateSwitch) {
              headerTl.fromTo(
                "[data-sanctuary-eyebrow]",
                { y: 12, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.75, ease: "expo.out" },
                0
              );
            }

            headerTl
              .fromTo(
                titleSplit.lines,
                { yPercent: 115 },
                {
                  yPercent: 0,
                  duration: isImmediateSwitch ? 0.85 : 1.15,
                  stagger: 0.09,
                  ease: "expo.out",
                },
                isImmediateSwitch ? 0 : 0.08
              )
              .fromTo(
                subtitleRef.current?.querySelectorAll("p") ?? [],
                { y: 14, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.8,
                  stagger: 0.07,
                  ease: "expo.out",
                },
                isImmediateSwitch ? 0.1 : 0.24
              );
          }, sheet);

          if (!isImmediateSwitch) {
            ScrollTrigger.refresh();
          }
        });
      }

      return () => {
        isCancelled = true;
        observer.disconnect();
        slideTweenRef.current?.kill();
        draggableRef.current?.kill();
        draggableRef.current = null;
        titleSplit?.revert();
        fontCtx?.revert();
      };
    },
    { scope: sheetRef, dependencies: [activeIndex] }
  );

  const handleSelectSanctuary = (index: number) => {
    if (index === activeIndex) return;
    hasInteractedTabRef.current = true;
    setActiveIndex(index);
  };

  const handleSlide = (direction: -1 | 1) => {
    const viewport = trackViewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const { minX } = boundsRef.current;
    if (minX >= 0) return;

    const currentX = (gsap.getProperty(track, "x") as number) || 0;
    const step = Math.min(440, Math.max(280, viewport.clientWidth * 0.34));
    const targetX = Math.max(minX, Math.min(0, currentX - direction * step));

    slideTweenRef.current?.kill();
    slideTweenRef.current = gsap.to(track, {
      x: targetX,
      duration: 0.85,
      ease: "expo.out",
      onUpdate: () => {
        const liveX = (gsap.getProperty(track, "x") as number) || 0;
        draggableRef.current?.update(true);
        syncTrackState(liveX);
      },
      onComplete: () => {
        draggableRef.current?.update(true);
        syncTrackState(targetX);
      },
    });
  };

  const handleReserveSanctuary = () => {
    const existing = readItinerary();
    writeItinerary({
      ...existing,
      region: activeSanctuary.region,
      guests: Math.min(activeSanctuary.maxGuests, 4),
      sanctuaryTitle: activeSanctuary.tabLabel,
      nightlyRate: activeSanctuary.nightlyRate,
    });
    const detail: SanctuarySelectionDetail = {
      region: activeSanctuary.region,
      guests: Math.min(activeSanctuary.maxGuests, 4),
      sanctuaryTitle: activeSanctuary.tabLabel,
      nightlyRate: activeSanctuary.nightlyRate,
    };
    window.dispatchEvent(
      new CustomEvent<SanctuarySelectionDetail>("yatra-select-sanctuary", {
        detail,
      })
    );
    document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="expeditions"
      className={styles.sanctuaries}
      aria-labelledby="sanctuary-heading"
    >
      <div ref={sheetRef} className={styles.sheet}>
        <div ref={headerRef} className={styles.header}>
          <span className={styles.eyebrow} data-sanctuary-eyebrow>
            {activeSanctuary.eyebrow}
          </span>

          <h2
            key={activeSanctuary.id}
            ref={titleRef}
            id="sanctuary-heading"
            className={styles.title}
          >
            <span className={styles.titleLine}>
              {activeSanctuary.titleLines[0]}
            </span>
            <span className={styles.titleLine}>
              {activeSanctuary.titleLines[1]}
            </span>
          </h2>

          <div ref={subtitleRef} className={styles.subtitle}>
            <p>{activeSanctuary.description[0]}</p>
            <p>{activeSanctuary.description[1]}</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Select Himalayan Sanctuary"
          >
            {SANCTUARIES.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`${styles.tab} ${isSelected ? styles.tabActive : ""}`}
                  onClick={() => handleSelectSanctuary(idx)}
                >
                  <span className={styles.tabIndex}>{item.index}</span>
                  <span>{item.tabLabel}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.navControls}>
            <span className={styles.dragHint}>Drag or slide</span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => handleSlide(-1)}
              disabled={!canPrev}
              aria-label="Scroll sanctuary gallery left"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => handleSlide(1)}
              disabled={!canNext}
              aria-label="Scroll sanctuary gallery right"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={trackViewportRef}
          className={styles.trackViewport}
          role="region"
          aria-label={`${activeSanctuary.tabLabel} highlights and photography`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") handleSlide(1);
            if (e.key === "ArrowLeft") handleSlide(-1);
          }}
        >
          <div key={activeSanctuary.id} ref={trackRef} className={styles.track}>
            {activeSanctuary.cards.map((card) =>
              card.kind === "info" ? (
                <article
                  key={card.id}
                  className={styles.infoCard}
                  data-sanctuary-card
                >
                  <h3 className={styles.cardHeading}>{card.heading}</h3>

                  <ul className={styles.specsList}>
                    {card.specs.map((spec) => (
                      <li key={spec.label} className={styles.specRow}>
                        <span
                          className={styles.specRule}
                          data-spec-rule
                          aria-hidden="true"
                        />
                        <span className={styles.specIcon}>
                          <SanctuaryIcon name={spec.icon} size={16} />
                        </span>
                        <span className={styles.specText}>{spec.label}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ) : (
                <figure
                  key={card.id}
                  className={styles.photoCard}
                  data-sanctuary-card
                >
                  <div className={styles.photoWrap}>
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 640px) 82vw, 490px"
                      className={styles.photoImage}
                      draggable={false}
                    />
                  </div>
                  <figcaption className={styles.photoPill}>
                    <SanctuaryIcon name={card.badgeIcon} size={13} />
                    <span>{card.badgeLabel}</span>
                  </figcaption>
                </figure>
              )
            )}
          </div>
        </div>

        <div className={styles.progressWrap} aria-hidden="true">
          <div ref={progressFillRef} className={styles.progressFill} />
        </div>

        <div className={styles.bookingBar}>
          <div className={styles.bookingMeta}>
            <div className={styles.bookingTitleRow}>
              <span className={styles.bookingName}>
                {activeSanctuary.tabLabel}
              </span>
              <span className={styles.availability}>
                <span className={styles.availabilityDot} aria-hidden="true" />
                {activeSanctuary.availability}
              </span>
            </div>
            <span className={styles.bookingSub}>
              {activeSanctuary.location} · Up to {activeSanctuary.maxGuests}{" "}
              Guests · {activeSanctuary.areaSqm} SQM
            </span>
          </div>

          <div className={styles.bookingActions}>
            <div className={styles.rate}>
              <strong>${activeSanctuary.nightlyRate}</strong>
              <span>Per Night · Private Buyout</span>
            </div>

            <Rounded className={styles.reserveBtn} backgroundColor="#141414">
              <button
                type="button"
                className={styles.reserveInner}
                onClick={handleReserveSanctuary}
              >
                <span>Reserve Sanctuary</span>
                <span className={styles.reserveArrow} aria-hidden="true">
                  →
                </span>
              </button>
            </Rounded>
          </div>
        </div>
      </div>
    </section>
  );
}

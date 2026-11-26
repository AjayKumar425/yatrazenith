"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./style.module.scss";

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  duration?: number;
  immediate?: boolean;
  inline?: boolean;
}

export default function MaskReveal({
  children,
  className = "",
  innerClassName = "",
  delay = 0,
  duration = 1.05,
  immediate = false,
  inline = false,
}: MaskRevealProps) {
  const maskRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const maskEl = maskRef.current;
    const innerEl = innerRef.current;
    if (!maskEl || !innerEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(innerEl, { yPercent: 0, clearProps: "transform" });
      return;
    }

    let hasRevealed = false;
    let tween: gsap.core.Tween | null = null;

    const reveal = () => {
      if (hasRevealed) return;
      hasRevealed = true;
      tween?.kill();
      tween = gsap.fromTo(
        innerEl,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration,
          delay,
          ease: "expo.out",
          clearProps: "transform",
        }
      );
    };

    if (immediate) {
      gsap.set(innerEl, { yPercent: 110 });
      let cancelled = false;
      const fallback = window.setTimeout(() => {
        if (!cancelled) reveal();
      }, 450);
      document.fonts.ready.then(() => {
        if (!cancelled) {
          window.clearTimeout(fallback);
          reveal();
        }
      });
      return () => {
        cancelled = true;
        window.clearTimeout(fallback);
        tween?.kill();
      };
    }

    const rect = maskEl.getBoundingClientRect();
    const alreadyVisibleOrPassed = rect.top <= window.innerHeight * 0.96;

    if (alreadyVisibleOrPassed) {
      reveal();
      return () => {
        tween?.kill();
      };
    }

    gsap.set(innerEl, { yPercent: 110 });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            reveal();
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    observer.observe(maskEl);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [delay, duration, immediate]);

  return (
    <span
      ref={maskRef}
      className={`${styles.mask} ${inline ? styles.inlineMask : ""} ${className}`.trim()}
    >
      <span
        ref={innerRef}
        className={`${styles.inner} ${inline ? styles.inlineInner : ""} ${innerClassName}`.trim()}
      >
        {children}
      </span>
    </span>
  );
}

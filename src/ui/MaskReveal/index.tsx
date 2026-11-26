"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  duration?: number;
  immediate?: boolean;
  inline?: boolean;
  start?: string;
}

export default function MaskReveal({
  children,
  className = "",
  innerClassName = "",
  delay = 0,
  duration = 1.0,
  immediate = false,
  inline = false,
  start = "top 88%",
}: MaskRevealProps) {
  const maskRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const maskEl = maskRef.current;
      const innerEl = innerRef.current;
      if (!maskEl || !innerEl) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(innerEl, { yPercent: 0, autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        innerEl,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration,
          delay,
          ease: "expo.out",
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: maskEl,
                  start,
                  once: true,
                },
              }),
        }
      );
    },
    { scope: maskRef, dependencies: [delay, duration, immediate, start] }
  );

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

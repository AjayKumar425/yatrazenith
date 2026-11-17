"use client";

import styles from "./style.module.scss";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export default function Philo() {
  const philoRef = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      let isMounted = true;
      let headingSplit: SplitText | undefined;
      let paraSplit: SplitText | undefined;

      const initAnimation = contextSafe!(() => {
        if (!isMounted || !philoRef.current) return;

        headingSplit = new SplitText(`.${styles.heading} h1`, {
          type: "lines, words",
          linesClass: styles.line,
        });

        paraSplit = new SplitText(`.${styles.para} p`, {
          type: "lines",
          linesClass: styles.line,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: philoRef.current,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        tl.from(`.${styles.eyebrow}`, {
          y: 12,
          opacity: 0,
          duration: 0.6,
        })
          .from(
            headingSplit.lines,
            {
              yPercent: 100,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              duration: 0.9,
              stagger: 0.12,
              clearProps: "clipPath",
            },
            "-=0.35"
          )
          .from(
            paraSplit.lines,
            {
              yPercent: 100,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              duration: 0.8,
              stagger: 0.08,
              clearProps: "clipPath",
            },
            "-=0.55"
          )
          .from(
            `.${styles.subTag}`,
            {
              y: 10,
              opacity: 0,
              duration: 0.6,
            },
            "-=0.4"
          );
      });

      // Wait for custom web fonts before splitting so line breaks calculate accurately
      document.fonts.ready.then(() => {
        initAnimation();
      });

      return () => {
        isMounted = false;
        headingSplit?.revert();
        paraSplit?.revert();
      };
    },
    { scope: philoRef }
  );

  return (
    <section className={styles.philo} ref={philoRef}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>
          01 <span>/</span> OUR PHILOSOPHY
        </span>

        <div className={styles.heading}>
          <h1>Travel well. Go deeper.</h1>
        </div>

        <div className={styles.para}>
          <p>
            We bring together distinctive places, knowledgeable local guides,
            and considered itineraries for a more personal experience of the
            Himalayas.
          </p>
          <span className={styles.subTag}>
            THOUGHTFULLY CURATED <span>/</span> DEEPLY PERSONAL
          </span>
        </div>
      </div>
    </section>
  );
}
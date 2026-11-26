"use client";

import MaskReveal from "@/ui/MaskReveal";
import styles from "./style.module.scss";

export default function Philo() {
  return (
    <section className={styles.philo} aria-labelledby="philo-heading">
      <div className={styles.container}>
        <div className={styles.headingCol}>
          <MaskReveal className={styles.eyebrow}>
            02 / Guiding Principle
          </MaskReveal>
          <h2 id="philo-heading" className={styles.heading}>
            <MaskReveal delay={0.08}>Travel well.</MaskReveal>
            <MaskReveal delay={0.18}>
              <em>Go deeper.</em>
            </MaskReveal>
          </h2>
        </div>

        <div className={styles.paraCol}>
          <MaskReveal delay={0.14} className={styles.para}>
            We bring together distinctive places, knowledgeable local guides,
            and considered itineraries for a more personal experience of the
            Himalayas.
          </MaskReveal>
          <MaskReveal delay={0.22} className={styles.subNote}>
            Private stays · Naturalist traverses · Thermal restoration
          </MaskReveal>
        </div>
      </div>
    </section>
  );
}

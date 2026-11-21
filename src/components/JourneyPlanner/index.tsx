"use client";

import { useState } from "react";
import styles from "./style.module.scss";

const REGIONS = [
  "Ladakh & Indus Valley",
  "Garhwal & Uttarakhand",
  "Spiti High Desert",
  "Multi-Region Traverse",
];

const SEASONS = [
  "Spring (Apr–May)",
  "High Summer (Jun–Aug)",
  "Autumn Gold (Sep–Nov)",
  "Winter Quiet (Dec–Feb)",
];

export default function JourneyPlanner() {
  const [region, setRegion] = useState(REGIONS[0]);
  const [season, setSeason] = useState(SEASONS[0]);
  const [nights, setNights] = useState(8);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const low = Math.round((480 * nights * guests * 0.9) / 100) * 100;
  const high = Math.round((480 * nights * guests * 1.12) / 100) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      setStatus("Please provide your name and a valid email address.");
      return;
    }
    setStatus(
      `Thank you, ${name}. Your private brief for ${region} (${nights} nights, ${guests} guests) has been received.`
    );
    setName("");
    setEmail("");
  };

  return (
    <section id="plan" className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Private Atelier</span>
        <h2 className={styles.heading}>
          Compose Your <em>Journey Brief</em>
        </h2>

        <div className={styles.grid}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.group}>
              <label className={styles.label}>01 / Himalayan Region</label>
              <div className={styles.chips}>
                {REGIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.chip} ${region === item ? styles.selected : ""}`}
                    onClick={() => setRegion(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <label className={styles.label}>02 / Preferred Season</label>
              <div className={styles.chips}>
                {SEASONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.chip} ${season === item ? styles.selected : ""}`}
                    onClick={() => setSeason(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlsRow}>
              <div>
                <label className={styles.label} htmlFor="nights-slider">
                  03 / Duration ({nights} Nights)
                </label>
                <input
                  id="nights-slider"
                  type="range"
                  min={4}
                  max={16}
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                />
              </div>
              <div>
                <label className={styles.label}>04 / Travellers</label>
                <div className={styles.stepper}>
                  <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
                  <span>{guests}</span>
                  <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))}>+</button>
                </div>
              </div>
            </div>

            <div className={styles.inputsRow}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submit}>
              Request Private Dossier →
            </button>
            {status && <p className={styles.status}>{status}</p>}
          </form>

          <aside className={styles.preview}>
            <span className={styles.eyebrow}>Live Curation Preview</span>
            <h3 className={styles.previewTitle}>{region} Passage</h3>
            <div className={styles.row}><span>Season</span><span>{season}</span></div>
            <div className={styles.row}><span>Passage</span><span>{nights} Nights · {guests} Guests</span></div>
            <div className={styles.row}>
              <span>Indicative Range</span>
              <span>${low.toLocaleString()} – ${high.toLocaleString()}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

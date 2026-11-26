"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SanctuarySelectionDetail } from "@/components/Sanctuaries";
import {
  ITINERARY_EVENT,
  readItinerary,
  writeItinerary,
  type ItinerarySelectionItem,
  type StoredItinerary,
} from "@/lib/itinerary";
import MaskReveal from "@/ui/MaskReveal";
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
  const [selectedSanctuary, setSelectedSanctuary] = useState<{
    title: string;
    nightlyRate: number;
  } | null>(null);
  const [menuItems, setMenuItems] = useState<ItinerarySelectionItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const hydrateFromStored = (stored: StoredItinerary) => {
      if (stored.region && REGIONS.includes(stored.region)) {
        setRegion(stored.region);
      }
      if (typeof stored.guests === "number") {
        setGuests(Math.min(14, Math.max(1, stored.guests)));
      }
      if (stored.sanctuaryTitle && stored.nightlyRate) {
        setSelectedSanctuary({
          title: stored.sanctuaryTitle,
          nightlyRate: stored.nightlyRate,
        });
      }
      setMenuItems(stored.menuItems ?? []);
    };

    hydrateFromStored(readItinerary());

    const onSelectSanctuary = (e: Event) => {
      const detail = (e as CustomEvent<SanctuarySelectionDetail>).detail;
      if (!detail) return;
      if (REGIONS.includes(detail.region)) {
        setRegion(detail.region);
      }
      setGuests(detail.guests);
      setSelectedSanctuary({
        title: detail.sanctuaryTitle,
        nightlyRate: detail.nightlyRate,
      });
      setStatus(null);
    };

    const onItineraryUpdated = (e: Event) => {
      const detail = (e as CustomEvent<StoredItinerary>).detail;
      if (detail) hydrateFromStored(detail);
    };

    window.addEventListener("yatra-select-sanctuary", onSelectSanctuary);
    window.addEventListener(ITINERARY_EVENT, onItineraryUpdated);
    return () => {
      window.removeEventListener("yatra-select-sanctuary", onSelectSanctuary);
      window.removeEventListener(ITINERARY_EVENT, onItineraryUpdated);
    };
  }, []);

  const handleRemoveMenuItem = (id: string) => {
    const next = menuItems.filter((item) => item.id !== id);
    setMenuItems(next);
    const current = readItinerary();
    writeItinerary({ ...current, menuItems: next });
  };

  const baseRate = selectedSanctuary ? selectedSanctuary.nightlyRate : 480 * guests;
  const menuAddonsTotal = menuItems.reduce((sum, item) => sum + item.price, 0);
  const low = Math.round(((baseRate * nights + menuAddonsTotal) * 0.9) / 100) * 100;
  const high = Math.round(((baseRate * nights + menuAddonsTotal) * 1.12) / 100) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      setStatus("Please provide your name and a valid email address.");
      return;
    }
    const sanctuaryNote = selectedSanctuary
      ? ` featuring ${selectedSanctuary.title}`
      : "";
    const menuNote =
      menuItems.length > 0 ? ` with ${menuItems.length} menu selections` : "";
    setStatus(
      `Thank you, ${name}. Your private brief for ${region}${sanctuaryNote}${menuNote} (${nights} nights, ${guests} guests) has been received.`
    );
    setName("");
    setEmail("");
  };

  return (
    <section id="plan" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topRule} aria-hidden="true" />
        <div className={styles.headerRow}>
          <div>
            <MaskReveal className={styles.eyebrow}>
              04 / Private Atelier
            </MaskReveal>
            <h2 className={styles.heading}>
              <MaskReveal delay={0.08}>
                Compose Your <em>Journey Brief</em>
              </MaskReveal>
            </h2>
          </div>

          <Link href="/menu" className={styles.menuShortcut}>
            <span>Add Experiences from Menu</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

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
                    onClick={() => {
                      setRegion(item);
                      setSelectedSanctuary(null);
                    }}
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
                  className={styles.range}
                />
              </div>
              <div>
                <label className={styles.label}>04 / Travellers</label>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    aria-label="Decrease travellers"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  >
                    −
                  </button>
                  <span>{guests}</span>
                  <button
                    type="button"
                    aria-label="Increase travellers"
                    onClick={() => setGuests((g) => Math.min(14, g + 1))}
                  >
                    +
                  </button>
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
            {selectedSanctuary && (
              <div className={styles.row}>
                <span>Sanctuary</span>
                <span>{selectedSanctuary.title}</span>
              </div>
            )}
            <div className={styles.row}>
              <span>Season</span>
              <span>{season}</span>
            </div>
            <div className={styles.row}>
              <span>Passage</span>
              <span>
                {nights} Nights · {guests} Guests
              </span>
            </div>
            {menuItems.length > 0 && (
              <div className={styles.addonsBlock}>
                <span className={styles.addonsLabel}>
                  Menu Selections ({menuItems.length})
                </span>
                <ul className={styles.addonsList}>
                  {menuItems.map((item) => (
                    <li key={item.id} className={styles.addonItem}>
                      <span>{item.title}</span>
                      <button
                        type="button"
                        className={styles.addonRemove}
                        onClick={() => handleRemoveMenuItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.row}>
              <span>Indicative Range</span>
              <strong>
                ${low.toLocaleString()} – ${high.toLocaleString()}
              </strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

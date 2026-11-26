"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MaskReveal from "@/ui/MaskReveal";
import {
  getServerItinerary,
  readItinerary,
  subscribeItinerary,
  writeItinerary,
} from "@/lib/itinerary";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  MENU_REGIONS,
  type MenuCategory,
  type MenuItem,
} from "./data";
import styles from "./style.module.scss";

gsap.registerPlugin(useGSAP);

export default function MenuCatalog() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"All" | MenuCategory>("All");
  const [activeRegion, setActiveRegion] =
    useState<(typeof MENU_REGIONS)[number]>("All Regions");
  const [hasFiltered, setHasFiltered] = useState(false);

  const itinerary = useSyncExternalStore(
    subscribeItinerary,
    readItinerary,
    getServerItinerary
  );
  const selectedItems = itinerary.menuItems;
  const catalogRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const catMatch =
        activeCategory === "All" || item.category === activeCategory;
      const regMatch =
        activeRegion === "All Regions" || item.region === activeRegion;
      return catMatch && regMatch;
    });
  }, [activeCategory, activeRegion]);

  const groupedSections = useMemo(() => {
    const catsToRender =
      activeCategory === "All"
        ? MENU_CATEGORIES.filter(
            (c): c is { id: MenuCategory; label: string; subtitle: string } =>
              c.id !== "All"
          )
        : MENU_CATEGORIES.filter(
            (c): c is { id: MenuCategory; label: string; subtitle: string } =>
              c.id === activeCategory
          );

    return catsToRender
      .map((cat, idx) => ({
        ...cat,
        sectionNum: String(idx + 1).padStart(2, "0"),
        items: filteredItems.filter((item) => item.category === cat.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCategory, filteredItems]);

  useGSAP(
    () => {
      const container = catalogRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      const rows = container.querySelectorAll("[data-index-row]");
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.72,
          stagger: 0.035,
          ease: "expo.out",
          clearProps: "transform",
        }
      );
    },
    { scope: catalogRef, dependencies: [activeCategory, activeRegion] }
  );

  const isSelected = (id: string) =>
    selectedItems.some((entry) => entry.id === id);

  const toggleItem = (item: MenuItem) => {
    const exists = isSelected(item.id);
    const next = exists
      ? selectedItems.filter((entry) => entry.id !== item.id)
      : [
          ...selectedItems,
          {
            id: item.id,
            title: item.title,
            category: item.category,
            region: item.region,
            price: item.price,
            unitLabel: item.unitLabel,
          },
        ];

    const current = readItinerary();
    writeItinerary({
      ...current,
      menuItems: next,
    });
  };

  const clearSelection = () => {
    const current = readItinerary();
    writeItinerary({
      ...current,
      menuItems: [],
    });
  };

  const handleProceedToBrief = () => {
    const current = readItinerary();
    const firstRegion = selectedItems[0]?.region;
    const firstSanctuary = selectedItems.find(
      (item) => item.category === "Sanctuaries"
    );

    writeItinerary({
      ...current,
      region: firstRegion ?? current.region,
      sanctuaryTitle: firstSanctuary
        ? firstSanctuary.title
        : current.sanctuaryTitle,
      nightlyRate: firstSanctuary ? firstSanctuary.price : current.nightlyRate,
      menuItems: selectedItems,
    });

    router.push("/#plan");
  };

  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroMeta}>
            <MaskReveal immediate className={styles.eyebrow}>
              Curated Index · 2026–27 Season
            </MaskReveal>
            <MaskReveal immediate delay={0.08} className={styles.heroStats}>
              12 Offerings · Garhwal · Ladakh · Spiti
            </MaskReveal>
          </div>

          <h1 className={styles.title}>
            <MaskReveal immediate delay={0.1}>
              Stays, Traverses &amp; <em>Alpine Rituals</em>
            </MaskReveal>
          </h1>

          <div className={styles.heroLeadWrap}>
            <MaskReveal immediate delay={0.18} className={styles.lead}>
              An architectural ledger of private mountain sanctuaries,
              naturalist-led passages, thermal soaks, and hearth dining. Select
              individual experiences to compose your brief.
            </MaskReveal>
          </div>
        </div>
      </section>

      <section className={styles.controlsSection} aria-label="Menu filters">
        <div className={styles.container}>
          <div className={styles.filterBar}>
            <div
              className={styles.categoryTabs}
              role="tablist"
              aria-label="Filter by category"
            >
              {MENU_CATEGORIES.map((cat) => {
                const count =
                  cat.id === "All"
                    ? MENU_ITEMS.length
                    : MENU_ITEMS.filter((i) => i.category === cat.id).length;
                const active = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`${styles.catBtn} ${active ? styles.catBtnActive : ""}`}
                    onClick={() => {
                      setHasFiltered(true);
                      setActiveCategory(cat.id);
                    }}
                  >
                    <span>{cat.label}</span>
                    <sup className={styles.catCount}>
                      {String(count).padStart(2, "0")}
                    </sup>
                  </button>
                );
              })}
            </div>

            <div className={styles.rightControls}>
              <label className={styles.selectWrap}>
                <span className={styles.srOnly}>Filter by region</span>
                <select
                  value={activeRegion}
                  onChange={(e) => {
                    setHasFiltered(true);
                    setActiveRegion(
                      e.target.value as (typeof MENU_REGIONS)[number]
                    );
                  }}
                  className={styles.regionSelect}
                >
                  {MENU_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              <span className={styles.resultCount}>
                {String(filteredItems.length).padStart(2, "0")} /{" "}
                {MENU_ITEMS.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div ref={catalogRef} className={styles.container}>
          {groupedSections.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No offerings match the selected category and region.</p>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => {
                  setHasFiltered(true);
                  setActiveCategory("All");
                  setActiveRegion("All Regions");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.groupsStack}>
              {groupedSections.map((group) => (
                <div key={group.id} className={styles.categoryGroup}>
                  <div className={styles.groupHeader}>
                    <div className={styles.groupHeadingWrap}>
                      <MaskReveal
                        immediate={hasFiltered}
                        className={styles.groupEyebrow}
                      >
                        {group.sectionNum} / {group.label}
                      </MaskReveal>
                      <h2 className={styles.groupTitle}>
                        <MaskReveal immediate={hasFiltered} delay={0.06}>
                          {group.subtitle}
                        </MaskReveal>
                      </h2>
                    </div>

                    <div className={styles.groupMetaLabels} aria-hidden="true">
                      <span>Altitude &amp; Duration</span>
                      <span>Tariff</span>
                    </div>
                  </div>

                  <div className={styles.indexList}>
                    {group.items.map((item) => {
                      const added = isSelected(item.id);
                      return (
                        <article
                          key={item.id}
                          className={`${styles.indexRow} ${added ? styles.indexRowSelected : ""}`}
                          data-index-row
                        >
                          <div className={styles.rowCode}>
                            <span>{item.code}</span>
                          </div>

                          <div className={styles.rowThumb}>
                            <Image
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              fill
                              sizes="(max-width: 860px) 100vw, 140px"
                              className={styles.rowImg}
                            />
                          </div>

                          <div className={styles.rowMain}>
                            <div className={styles.rowMicro}>
                              <span>{item.region}</span>
                              <span>·</span>
                              <span>{item.highlights[0]}</span>
                              <span>·</span>
                              <span>{item.highlights[1]}</span>
                            </div>
                            <h3 className={styles.rowTitle}>{item.title}</h3>
                            <p className={styles.rowDesc}>{item.description}</p>
                          </div>

                          <div className={styles.rowSpecs}>
                            <span className={styles.rowElevation}>
                              {item.elevation}
                            </span>
                            <span className={styles.rowDuration}>
                              {item.duration}
                            </span>
                          </div>

                          <div className={styles.rowAction}>
                            <div className={styles.priceWrap}>
                              <strong className={styles.price}>
                                ${item.price}
                              </strong>
                              <span className={styles.unit}>
                                {item.unitLabel}
                              </span>
                            </div>

                            <div className={styles.actionControls}>
                              <button
                                type="button"
                                className={`${styles.selectBtn} ${added ? styles.selectBtnActive : ""}`}
                                onClick={() => toggleItem(item)}
                                aria-pressed={added}
                              >
                                {added ? "✓ Selected" : "+ Select"}
                              </button>
                              <span className={styles.rowCue} aria-hidden="true">
                                →
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedItems.length > 0 && (
        <aside
          className={styles.tray}
          aria-label="Selected itinerary offerings"
        >
          <div className={styles.trayInner}>
            <div className={styles.trayInfo}>
              <span className={styles.trayCount}>
                {selectedItems.length}{" "}
                {selectedItems.length === 1 ? "Selection" : "Selections"} · Est.{" "}
                <strong>${selectedTotal.toLocaleString()}</strong>
              </span>
              <div className={styles.trayChips}>
                {selectedItems.map((entry) => (
                  <span key={entry.id} className={styles.trayChip}>
                    {entry.title}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.trayActions}>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearSelection}
              >
                Clear
              </button>
              <button
                type="button"
                className={styles.proceedBtn}
                onClick={handleProceedToBrief}
              >
                <span>Proceed to Journey Brief</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

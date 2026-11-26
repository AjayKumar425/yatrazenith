"use client";

import { useState } from "react";
import Link from "next/link";
import MaskReveal from "@/ui/MaskReveal";
import Footer from "@/components/Footer";
import styles from "./style.module.scss";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      setSent("Please provide your name and a valid email address.");
      return;
    }
    setSent(
      `Thank you, ${name}. Our Dehradun concierge will reply within 24 hours.`
    );
    setName("");
    setEmail("");
    setNote("");
  };

  return (
    <main className={styles.contactPage}>
      <section className={styles.section}>
        <div className={styles.container}>
          <MaskReveal immediate className={styles.eyebrow}>
            Private Consultation · Dehradun &amp; Leh
          </MaskReveal>
          <h1 className={styles.title}>
            <MaskReveal immediate delay={0.08}>
              Speak With Our <em>Himalayan Atelier</em>
            </MaskReveal>
          </h1>

          <div className={styles.grid}>
            <div className={styles.infoCol}>
              <p className={styles.lead}>
                Every private expedition and full-estate buyout is coordinated
                directly with our mountain naturalists and regional hosts.
              </p>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Atelier Desk</span>
                  <a href="mailto:concierge@yatrazenith.com">
                    concierge@yatrazenith.com
                  </a>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Garhwal Base</span>
                  <span>Rajpur Road, Dehradun · Uttarakhand</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Coordinates</span>
                  <span>30.0668° N · 79.0193° E</span>
                </div>
              </div>

              <Link href="/menu" className={styles.menuLink}>
                <span>Explore Curated Menu</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              <textarea
                rows={4}
                placeholder="Tell us about your preferred season, party size, or sanctuary interests"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.textarea}
              />
              <button type="submit" className={styles.submit}>
                Send Inquiry →
              </button>
              {sent && <p className={styles.status}>{sent}</p>}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

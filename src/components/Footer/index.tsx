"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./style.module.scss";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setIstTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };
    updateClock();
    const id = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(id);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    setMessage("Welcome to The Seasonal Dispatch.");
    setEmail("");
  };

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <h2 className={styles.lead}>
            Let the mountains set the <em>tempo</em> of your next chapter.
          </h2>
          <form className={styles.newsletter} onSubmit={handleSubscribe} noValidate>
            <label htmlFor="footer-email" className={styles.label}>
              The Seasonal Dispatch — Quarterly Notes &amp; Private Openings
            </label>
            <div className={styles.inputWrap}>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe →</button>
            </div>
            {message && <span className={styles.msg}>{message}</span>}
          </form>
        </div>

        <div className={styles.columns}>
          <div>
            <div className={styles.colTitle}>Navigation</div>
            <ul className={styles.list}>
              <li><Link href="#top">Sanctuary</Link></li>
              <li><Link href="#philosophy">Philosophy</Link></li>
              <li><Link href="#expeditions">Expeditions</Link></li>
              <li><Link href="#plan">Plan Journey</Link></li>
            </ul>
          </div>
          <div>
            <div className={styles.colTitle}>Regions</div>
            <ul className={styles.list}>
              <li>Ladakh &amp; Indus Valley</li>
              <li>Garhwal Himalayas</li>
              <li>Spiti High Desert</li>
              <li>Custom Multi-Region</li>
            </ul>
          </div>
          <div>
            <div className={styles.colTitle}>Himalayan Atelier</div>
            <ul className={styles.list}>
              <li>Rajpur Road, Dehradun</li>
              <li>Uttarakhand, India</li>
              <li>30.0668° N, 79.0193° E</li>
              <li>Local Time: {istTime} IST</li>
            </ul>
          </div>
          <div>
            <div className={styles.colTitle}>Concierge</div>
            <ul className={styles.list}>
              <li><a href="mailto:concierge@yatrazenith.com">concierge@yatrazenith.com</a></li>
              <li><Link href="/contact">Private Consultation</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.wordmark} aria-hidden="true">Yatra Zenith</div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Yatra Zenith · Luxury Retreat &amp; Expeditions</span>
          <a href="#top" className={styles.backTop}>Back to Top ↑</a>
        </div>
      </div>
    </footer>
  );
}

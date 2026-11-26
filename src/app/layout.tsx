import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const editorial = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    {
      path: "../../public/font/PP Editorial New Ultralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/font/PP Editorial New.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yatra Zenith — Luxury Retreat & Expeditions",
  description: "Find the spirit of the Himalayas at Yatra Zenith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${editorial.variable} ${jakarta.variable} ${geistMono.variable}`}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
      <html lang="en" className={`${jakarta.variable} ${geistMono.variable}`}>
      <head>
        <link
            rel="preload"
            href="/font/PP%20Editorial%20New%20Ultralight.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
        />
        <link
            rel="preload"
            href="/font/PP%20Editorial%20New.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        {children}
      </body>
      </html>
  );
}
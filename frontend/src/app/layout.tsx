import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Green Harvest — Farm to Table, Reimagined",
    template: "%s · Green Harvest",
  },
  description:
    "A modern marketplace connecting local growers with conscious eaters. Seasonal, sustainable, sourced with care.",
  metadataBase: new URL("https://greenharvest.local"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

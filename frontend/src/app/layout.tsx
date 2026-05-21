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
    default: "Green Harvest — Belanja Hasil Tani Langsung dari Petani",
    template: "%s · Green Harvest",
  },
  description:
    "Marketplace hasil tani Indonesia. Sayur, buah, beras, rempah, bibit, pupuk, dan produk UMKM pangan lokal — langsung dari petani.",
  metadataBase: new URL("https://greenharvest.id"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fraunces.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

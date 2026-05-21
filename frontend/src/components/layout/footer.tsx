import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

const FOOTER_GROUPS = [
  {
    title: "Belanja",
    links: [
      { href: "/kategori/sayuran", label: "Sayuran" },
      { href: "/kategori/buah", label: "Buah-buahan" },
      { href: "/kategori/beras", label: "Beras" },
      { href: "/kategori/rempah", label: "Rempah" },
      { href: "/kategori/bibit", label: "Bibit Tanaman" },
      { href: "/kategori/pupuk", label: "Pupuk" },
    ],
  },
  {
    title: "Untuk Petani",
    links: [
      { href: "/jadi-penjual", label: "Daftar Penjual" },
      { href: "/panduan-penjual", label: "Panduan Berjualan" },
      { href: "/biaya", label: "Biaya & Komisi" },
      { href: "/cerita-petani", label: "Cerita Petani" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { href: "/bantuan", label: "Pusat Bantuan" },
      { href: "/pengiriman", label: "Pengiriman" },
      { href: "/pembayaran", label: "Metode Pembayaran" },
      { href: "/pengembalian", label: "Pengembalian" },
      { href: "/kontak", label: "Hubungi Kami" },
    ],
  },
];

const PAYMENTS = ["BCA", "Mandiri", "BNI", "BRI", "OVO", "GoPay", "Dana", "QRIS"];

export function Footer() {
  return (
    <footer data-testid="site-footer" className="mt-auto border-t border-border bg-harvest-soil text-harvest-cream">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-4">
            <Logo variant="inverted" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-harvest-cream/70">
              Marketplace hasil tani terpercaya yang menghubungkan petani lokal dengan konsumen di seluruh Indonesia. Segar, adil, dan dekat dari kebun.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-harvest-cream/70">
              <li className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-harvest-amber" />
                halo@greenharvest.id
              </li>
              <li className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-harvest-amber" />
                0800-1234-TANI (8264)
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-harvest-amber" />
                Jakarta, Bandung, Yogyakarta, Surabaya
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <Link href="#" aria-label="Instagram" data-testid="social-instagram" className="grid h-9 w-9 place-items-center rounded-full bg-harvest-cream/10 text-harvest-cream transition-colors hover:bg-harvest-gold hover:text-harvest-soil">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="Facebook" data-testid="social-facebook" className="grid h-9 w-9 place-items-center rounded-full bg-harvest-cream/10 text-harvest-cream transition-colors hover:bg-harvest-gold hover:text-harvest-soil">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" aria-label="YouTube" data-testid="social-youtube" className="grid h-9 w-9 place-items-center rounded-full bg-harvest-cream/10 text-harvest-cream transition-colors hover:bg-harvest-gold hover:text-harvest-soil">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-harvest-amber">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-harvest-cream/75 transition-colors hover:text-harvest-cream"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-harvest-cream/15" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-harvest-cream/60">
              Pembayaran:
            </span>
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded-md bg-harvest-cream px-2 py-1 text-[10px] font-bold text-harvest-soil"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-harvest-cream/60" data-testid="footer-copyright">
            © {new Date().getFullYear()} Green Harvest Indonesia. Semua hak dilindungi.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-5 text-xs text-harvest-cream/60">
          <Link href="/kebijakan-privasi" className="hover:text-harvest-cream">
            Kebijakan Privasi
          </Link>
          <Link href="/syarat-ketentuan" className="hover:text-harvest-cream">
            Syarat & Ketentuan
          </Link>
          <Link href="/cookies" className="hover:text-harvest-cream">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}

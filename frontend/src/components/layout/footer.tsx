import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

const FOOTER_GROUPS = [
  {
    title: "Marketplace",
    links: [
      { href: "/market", label: "Browse market" },
      { href: "/seasons", label: "What's in season" },
      { href: "/growers", label: "Meet the growers" },
      { href: "/gift", label: "Gift cards" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/journal", label: "Journal" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help center" },
      { href: "/contact", label: "Contact" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="mt-auto border-t border-border/60 bg-card"
    >
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Seasonal produce, grown nearby, delivered with care. A marketplace
              for eaters who want to know where their food comes from.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link
                href="#"
                aria-label="Instagram"
                data-testid="social-instagram"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                data-testid="social-twitter"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                data-testid="social-youtube"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-testid={`footer-link-${link.label
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
          <p data-testid="footer-copyright">
            © {new Date().getFullYear()} Green Harvest Cooperative. All rights
            reserved.
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-foreground">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

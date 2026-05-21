"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  LayoutGrid,
  Store,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      {/* Top row */}
      <div className="container flex h-16 items-center gap-3 md:gap-6">
        <Logo />

        {/* Desktop search */}
        <form
          role="search"
          data-testid="navbar-search-form"
          className="relative hidden flex-1 md:block"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari sayur, buah, beras, pupuk, bibit…"
            aria-label="Cari produk"
            data-testid="navbar-search-input"
            className="h-11 w-full rounded-full border-harvest-moss/30 bg-background pl-11 pr-28 focus-visible:ring-harvest-moss/40"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-full px-5"
            data-testid="navbar-search-submit"
          >
            Cari
          </Button>
        </form>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden lg:inline-flex"
            data-testid="navbar-kategori-btn"
          >
            <Link href="/kategori">
              <LayoutGrid className="h-4 w-4" />
              Kategori
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileSearch((v) => !v)}
            data-testid="mobile-search-toggle"
            aria-label="Buka pencarian"
          >
            {showMobileSearch ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative"
            data-testid="navbar-cart-btn"
            aria-label="Keranjang"
          >
            <Link href="/keranjang">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-harvest-chili px-1 text-[10px] font-semibold text-white">
                3
              </span>
            </Link>
          </Button>

          <span className="mx-1 hidden h-6 w-px bg-border md:block" />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            data-testid="navbar-login-btn"
          >
            <Link href="/login">Masuk</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden md:inline-flex border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
            data-testid="navbar-register-btn"
          >
            <Link href="/register">Daftar</Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
            data-testid="navbar-jadi-penjual-btn"
          >
            <Link href="/jadi-penjual">
              <Store className="h-4 w-4" />
              Jadi Penjual
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                data-testid="mobile-menu-trigger"
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-2 mb-8">
                <Logo />
              </div>
              <nav
                className="flex flex-col gap-1"
                data-testid="mobile-nav"
                aria-label="Menu mobile"
              >
                <SheetClose asChild>
                  <Link
                    href="/kategori"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                    data-testid="mobile-nav-kategori"
                  >
                    <LayoutGrid className="h-4 w-4" /> Semua Kategori
                  </Link>
                </SheetClose>
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
                <SheetClose asChild>
                  <Button asChild variant="outline" data-testid="mobile-login-btn">
                    <Link href="/login">
                      <User className="h-4 w-4" /> Masuk
                    </Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild data-testid="mobile-register-btn">
                    <Link href="/register">Daftar Akun</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
                    data-testid="mobile-jadi-penjual-btn"
                  >
                    <Link href="/jadi-penjual">
                      <Store className="h-4 w-4" /> Jadi Penjual
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile inline search */}
      {showMobileSearch && (
        <div
          className="border-t border-border bg-card px-4 py-3 md:hidden"
          data-testid="mobile-search-panel"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder="Cari sayur, buah, beras, pupuk, bibit…"
              aria-label="Cari produk"
              data-testid="mobile-search-input"
              className="h-10 rounded-full border-harvest-moss/30 pl-10"
            />
          </div>
        </div>
      )}

      {/* Secondary nav strip */}
      <div className="hidden border-t border-border/60 bg-card md:block">
        <div
          className="container flex h-10 items-center gap-6 overflow-x-auto"
          data-testid="primary-nav-strip"
        >
          <Link
            href="/kategori"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-harvest-moss"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Semua Kategori
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              className={cn(
                "shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            Gratis ongkir untuk pesanan di atas{" "}
            <span className="font-semibold text-harvest-moss">Rp 100rb</span>
          </span>
        </div>
      </div>
    </header>
  );
}

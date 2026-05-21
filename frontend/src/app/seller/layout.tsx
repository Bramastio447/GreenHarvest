"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Wallet,
  Store,
  Settings,
  LogOut,
  Bell,
  Search,
  HelpCircle,
  type LucideIcon,
  Sprout,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SELLER_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/produk", label: "Produk", icon: Package },
  { href: "/seller/pesanan", label: "Pesanan", icon: ShoppingBag },
  { href: "/seller/pelanggan", label: "Pelanggan", icon: Users },
  { href: "/seller/analitik", label: "Analitik", icon: BarChart3 },
  { href: "/seller/pencairan", label: "Pencairan", icon: Wallet },
  { href: "/seller/profil", label: "Profil Petani", icon: Store },
  { href: "/seller/pengaturan", label: "Pengaturan", icon: Settings },
];

function SellerLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link
      href="/seller/dashboard"
      data-testid="seller-brand-logo"
      className="inline-flex items-center gap-2"
    >
      <span className="grid h-9 w-9 place-items-center rounded-md bg-harvest-moss text-harvest-cream shadow-sm">
        <Sprout className="h-5 w-5" strokeWidth={2.25} />
      </span>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-base font-semibold">
            Green<span className="italic text-harvest-moss"> Harvest</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-harvest-gold">
            Seller Center
          </span>
        </div>
      )}
    </Link>
  );
}

function SidebarContent() {
  const pathname = usePathname();
  return (
    <nav className="flex h-full flex-col gap-1" aria-label="Seller">
      <div className="px-2 pb-4 pt-2">
        <SellerLogo />
      </div>

      <Separator className="mb-2" />

      <div className="flex-1 space-y-0.5 px-2">
        {SELLER_NAV.map((item) => {
          const active =
            item.href === "/seller/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-harvest-moss text-harvest-cream"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <Separator className="my-2" />

      {/* Help card */}
      <div className="px-2 pb-2">
        <div className="rounded-lg bg-gradient-to-br from-harvest-moss/10 to-harvest-gold/10 p-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-harvest-moss" />
            <p className="text-xs font-semibold">Butuh bantuan?</p>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Tim kami siap membantu petani 7 hari seminggu.
          </p>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="mt-2 h-7 w-full border-harvest-moss/40 text-xs text-harvest-moss"
            data-testid="sidebar-help-btn"
          >
            <Link href="/bantuan">Pusat Bantuan</Link>
          </Button>
        </div>
      </div>

      <div className="px-2 pb-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          data-testid="sidebar-logout-btn"
        >
          <Link href="/login">
            <LogOut className="h-4 w-4" />
            Keluar
          </Link>
        </Button>
      </div>
    </nav>
  );
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="seller-shell"
      className="grid min-h-screen w-full bg-secondary/30 md:grid-cols-[256px_1fr]"
    >
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-border bg-card md:flex md:flex-col">
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-col">
        {/* Topbar */}
        <header
          data-testid="seller-topbar"
          className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 md:px-6"
        >
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Buka menu"
                data-testid="mobile-sidebar-trigger"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk, pesanan, pelanggan…"
              className="h-10 pl-10"
              data-testid="topbar-search-input"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden bg-harvest-gold text-harvest-soil hover:bg-harvest-amber sm:inline-flex"
              data-testid="topbar-add-product-btn"
            >
              <Link href="/seller/produk/tambah">
                <Package className="h-4 w-4" />
                Tambah Produk
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              data-testid="topbar-notifications-btn"
              aria-label="Notifikasi"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-harvest-chili" />
            </Button>

            <Link
              href="/seller/profil"
              data-testid="topbar-profile-link"
              className="flex items-center gap-2 rounded-full border border-border bg-card pr-3 transition-colors hover:border-harvest-moss/40"
            >
              <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-harvest-moss text-sm font-semibold text-harvest-cream">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=70"
                  alt="Pak Wahyu"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-semibold">Pak Wahyu P.</p>
                <p className="text-[10px] text-muted-foreground">Tani Makmur</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

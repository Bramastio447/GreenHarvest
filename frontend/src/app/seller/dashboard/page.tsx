"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Package,
  Banknote,
  Star,
  Plus,
  ListChecks,
  Receipt,
  Store,
  Eye,
  TrendingUp,
  Calendar,
  ChevronRight,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { rupiah, PRODUCTS } from "@/lib/products";
import { STATUS_META, type OrderStatus } from "@/lib/orders";

// =============== MOCK DATA ===============

interface Stat {
  label: string;
  value: string;
  delta: number; // %
  deltaIsCurrency?: boolean;
  icon: LucideIcon;
  tint: string;
  iconTint: string;
}

const STATS: Stat[] = [
  {
    label: "Pendapatan Minggu Ini",
    value: rupiah(4_820_000),
    delta: 12,
    icon: Banknote,
    tint: "from-harvest-moss/10 to-harvest-leaf/10",
    iconTint: "bg-harvest-moss/15 text-harvest-moss",
  },
  {
    label: "Pesanan",
    value: "38",
    delta: 8,
    icon: ShoppingBag,
    tint: "from-amber-100/40 to-amber-100/10",
    iconTint: "bg-amber-100 text-amber-700",
  },
  {
    label: "Total Produk Aktif",
    value: "126",
    delta: 6,
    icon: Package,
    tint: "from-blue-100/40 to-blue-100/10",
    iconTint: "bg-blue-100 text-blue-700",
  },
  {
    label: "Rating Toko",
    value: "4.9",
    delta: 0.1,
    icon: Star,
    tint: "from-harvest-gold/20 to-harvest-amber/10",
    iconTint: "bg-harvest-gold/20 text-harvest-gold",
  },
];

interface RecentOrder {
  id: string;
  buyer: string;
  buyerCity: string;
  productSummary: string;
  qty: number;
  date: string;
  total: number;
  status: OrderStatus;
}

const RECENT_ORDERS: RecentOrder[] = [
  {
    id: "GH-2026000821",
    buyer: "Rizki Pratama",
    buyerCity: "Jakarta Selatan",
    productSummary: "Tomat Ceri Segar + 2 lainnya",
    qty: 4,
    date: "18 Jan 2026, 14:32",
    total: 121500,
    status: "menunggu_pembayaran",
  },
  {
    id: "GH-2026000819",
    buyer: "Sari Wulandari",
    buyerCity: "Bandung",
    productSummary: "Selada Romaine + 1 lainnya",
    qty: 3,
    date: "18 Jan 2026, 11:08",
    total: 56500,
    status: "diproses_petani",
  },
  {
    id: "GH-2026000817",
    buyer: "Andi Saputra",
    buyerCity: "Tangerang",
    productSummary: "Bayam Hidroponik",
    qty: 6,
    date: "18 Jan 2026, 09:24",
    total: 71500,
    status: "diproses_petani",
  },
  {
    id: "GH-2026000810",
    buyer: "Lina Marlina",
    buyerCity: "Bekasi",
    productSummary: "Brokoli Segar + Tomat Beef",
    qty: 5,
    date: "17 Jan 2026, 18:45",
    total: 98500,
    status: "dikirim",
  },
  {
    id: "GH-2026000802",
    buyer: "Budi Hartono",
    buyerCity: "Depok",
    productSummary: "Tomat Ceri Segar",
    qty: 2,
    date: "17 Jan 2026, 10:12",
    total: 53500,
    status: "selesai",
  },
];

interface BestProduct {
  id: string;
  name: string;
  img: string;
  unit: string;
  price: number;
  sold: number;
  revenue: number;
  trend: number; // %
}

// Pull subset from PRODUCTS based on this farmer
const BEST_PRODUCTS: BestProduct[] = [
  PRODUCTS.find((p) => p.id === "p01")!,
  PRODUCTS.find((p) => p.id === "p29")!,
  PRODUCTS.find((p) => p.id === "p17")!,
].map((p, i) => ({
  id: p.id,
  name: p.name,
  img: p.img,
  unit: p.unit,
  price: p.price,
  sold: [148, 96, 72][i],
  revenue: p.price * [148, 96, 72][i],
  trend: [22, 14, -4][i],
}));

const QUICK_ACTIONS: {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
  testId: string;
}[] = [
  {
    href: "/seller/produk/baru",
    label: "Tambah Produk",
    desc: "Upload hasil panen baru ke etalase",
    icon: Plus,
    tint: "bg-gradient-to-br from-harvest-moss to-emerald-700 text-harvest-cream",
    testId: "quick-add-product",
  },
  {
    href: "/seller/produk",
    label: "Kelola Produk",
    desc: "Update stok, harga, dan deskripsi",
    icon: ListChecks,
    tint: "bg-gradient-to-br from-amber-500 to-harvest-gold text-harvest-soil",
    testId: "quick-manage-products",
  },
  {
    href: "/seller/pesanan",
    label: "Kelola Pesanan",
    desc: "Konfirmasi & kirim pesanan masuk",
    icon: Receipt,
    tint: "bg-gradient-to-br from-blue-600 to-violet-700 text-harvest-cream",
    testId: "quick-manage-orders",
  },
  {
    href: "/seller/profil",
    label: "Profil Petani",
    desc: "Update info toko & lokasi kebun",
    icon: Store,
    tint: "bg-gradient-to-br from-rose-600 to-harvest-chili text-harvest-cream",
    testId: "quick-farmer-profile",
  },
];

// =============== HELPERS ===============

function DeltaPill({ delta }: { delta: number }) {
  if (delta === 0)
    return <span className="text-xs text-muted-foreground">stabil</span>;
  const up = delta > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold",
        up
          ? "bg-harvest-moss/10 text-harvest-moss"
          : "bg-harvest-chili/10 text-harvest-chili"
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(delta)}%
    </span>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
        meta.tint
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

// =============== PAGE ===============

export default function SellerDashboardPage() {
  return (
    <div data-testid="seller-dashboard" className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-harvest-gold">
            <Calendar className="h-3.5 w-3.5" />
            Senin, 19 Januari 2026
          </p>
          <h1
            data-testid="dashboard-heading"
            className="mt-2 font-serif text-3xl tracking-tight md:text-4xl"
          >
            Selamat pagi, <span className="text-harvest-moss">Pak Wahyu</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ini ringkasan toko <span className="font-semibold">Tani Makmur</span> hari ini.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          data-testid="view-storefront-btn"
          className="border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
        >
          <Link href="/produk">
            <Eye className="h-4 w-4" />
            Lihat sebagai pembeli
          </Link>
        </Button>
      </header>

      {/* Stat cards */}
      <section data-testid="stat-cards" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
            className={cn(
              "rounded-xl border border-border bg-gradient-to-br p-5 transition-shadow hover:shadow-md",
              s.tint,
              "bg-card"
            )}
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg",
                  s.iconTint
                )}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <DeltaPill delta={s.delta} />
            </div>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 font-serif text-2xl font-bold md:text-3xl">{s.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              vs minggu lalu
            </p>
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section data-testid="quick-actions">
        <h2 className="mb-3 font-serif text-lg tracking-tight">Aksi Cepat</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              data-testid={q.testId}
              className={cn(
                "group relative overflow-hidden rounded-xl p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
                q.tint
              )}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
                <q.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-serif text-lg leading-tight">{q.label}</h3>
              <p className="mt-1 text-xs opacity-85">{q.desc}</p>
              <ChevronRight className="absolute right-4 top-4 h-5 w-5 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent orders + best products */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <section
          data-testid="recent-orders-section"
          className="rounded-xl border border-border bg-card lg:col-span-2"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-serif text-lg tracking-tight">Pesanan Terbaru</h2>
              <p className="text-xs text-muted-foreground">
                5 pesanan terakhir yang masuk ke toko-mu
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              data-testid="all-orders-link"
              className="text-harvest-moss"
            >
              <Link href="/seller/pesanan">
                Lihat semua <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </header>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <table className="w-full text-sm" data-testid="orders-table">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2 font-semibold">Pesanan</th>
                  <th className="py-2 font-semibold">Pembeli</th>
                  <th className="py-2 font-semibold">Produk</th>
                  <th className="py-2 font-semibold">Total</th>
                  <th className="py-2 font-semibold">Status</th>
                  <th className="px-5 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => (
                  <tr
                    key={o.id}
                    data-testid={`order-row-${o.id}`}
                    className="border-t border-border/60 transition-colors hover:bg-secondary/40"
                  >
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs font-bold">{o.id}</p>
                      <p className="text-[10px] text-muted-foreground">{o.date}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-medium">{o.buyer}</p>
                      <p className="text-[10px] text-muted-foreground">{o.buyerCity}</p>
                    </td>
                    <td className="py-3">
                      <p className="line-clamp-1 max-w-[220px] text-sm">{o.productSummary}</p>
                      <p className="text-[10px] text-muted-foreground">{o.qty} item</p>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-harvest-moss">{rupiah(o.total)}</p>
                    </td>
                    <td className="py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        data-testid={`order-detail-${o.id}`}
                      >
                        <Link href={`/seller/pesanan/${o.id}`}>Detail</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-border lg:hidden">
            {RECENT_ORDERS.map((o) => (
              <li
                key={o.id}
                className="flex flex-col gap-2 p-4"
                data-testid={`order-card-${o.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-bold">{o.id}</p>
                    <p className="text-[11px] text-muted-foreground">{o.date}</p>
                  </div>
                  <StatusPill status={o.status} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{o.buyer}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {o.buyerCity} · {o.qty} item
                  </p>
                </div>
                <p className="line-clamp-1 text-xs text-muted-foreground">{o.productSummary}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-harvest-moss">{rupiah(o.total)}</span>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/seller/pesanan/${o.id}`}>Detail</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Best selling products */}
        <section
          data-testid="best-selling-section"
          className="rounded-xl border border-border bg-card"
        >
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-serif text-lg tracking-tight">Produk Terlaris</h2>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-harvest-gold/15 px-2 py-0.5 text-[10px] font-bold text-harvest-soil">
              <TrendingUp className="h-3 w-3" /> TOP 3
            </span>
          </header>
          <ul className="divide-y divide-border">
            {BEST_PRODUCTS.map((p, i) => (
              <li
                key={p.id}
                data-testid={`best-product-${p.id}`}
                className="flex items-start gap-3 p-4"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full font-serif text-sm font-bold",
                    i === 0
                      ? "bg-harvest-gold text-harvest-soil"
                      : i === 1
                        ? "bg-stone-300 text-stone-800"
                        : "bg-orange-200 text-orange-800"
                  )}
                >
                  {i + 1}
                </span>
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.sold} terjual · {rupiah(p.price)}
                    {p.unit}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-harvest-moss">
                      {rupiah(p.revenue)}
                    </span>
                    <DeltaPill delta={p.trend} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border p-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full text-harvest-moss"
              data-testid="all-products-link"
            >
              <Link href="/seller/produk">
                Lihat semua produk <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Income summary */}
      <section
        data-testid="income-summary"
        className="grid gap-4 rounded-xl border border-border bg-gradient-to-br from-harvest-moss to-emerald-900 p-6 text-harvest-cream md:grid-cols-3 md:p-8"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-harvest-amber">
            Pencairan Tertunda
          </p>
          <p className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            {rupiah(2_450_000)}
          </p>
          <p className="text-xs text-harvest-cream/70">
            Akan masuk rekening dalam 2 hari kerja
          </p>
        </div>
        <Separator orientation="vertical" className="hidden bg-harvest-cream/15 md:block" />
        <div className="md:col-span-1 md:pl-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-harvest-amber">
            Pendapatan Bulan Ini
          </p>
          <p className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            {rupiah(18_640_000)}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-harvest-cream/80">
            <ArrowUpRight className="h-3 w-3 text-harvest-amber" />
            <span className="font-bold text-harvest-amber">+24%</span> vs bulan lalu
          </div>
        </div>
        <div className="flex flex-col gap-2 md:items-end md:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
            data-testid="withdraw-btn"
          >
            <Link href="/seller/pencairan">
              <Wallet className="h-4 w-4" />
              Cairkan Saldo
            </Link>
          </Button>
          <Link
            href="/seller/analitik"
            className="text-xs text-harvest-cream/70 underline-offset-4 hover:text-harvest-cream hover:underline"
          >
            Lihat detail analitik →
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Store,
  MapPin,
  Calendar,
  Truck,
  CreditCard,
  Eye,
  RefreshCw,
  XCircle,
  Star,
  Package,
  Clock,
  Receipt,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { rupiah } from "@/lib/products";
import {
  getOrders,
  STATUS_META,
  formatOrderDate,
  type HydratedOrder,
  type OrderStatus,
} from "@/lib/orders";

const FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "menunggu_pembayaran", label: "Menunggu Pembayaran" },
  { key: "diproses_petani", label: "Diproses Petani" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

const STAT_ICONS: Record<OrderStatus, typeof Clock> = {
  menunggu_pembayaran: Clock,
  diproses_petani: Package,
  dikirim: Truck,
  selesai: CheckCircle2,
  dibatalkan: XCircle,
};

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  const Icon = STAT_ICONS[status];
  return (
    <span
      data-testid={`status-pill-${status}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        meta.tint
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}

function OrderCard({ order }: { order: HydratedOrder }) {
  const totalQty = order.lines.reduce((s, l) => s + l.qty, 0);
  const firstItem = order.lines[0];
  const restCount = order.lines.length - 1;
  const status = order.status;

  return (
    <article
      data-testid={`order-card-${order.id}`}
      className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      {/* Top strip */}
      <header className="flex flex-wrap items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3 text-xs sm:px-5">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">No. Pesanan</span>
          <span className="font-mono font-bold text-foreground" data-testid={`order-id-${order.id}`}>
            {order.id}
          </span>
        </span>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span data-testid={`order-date-${order.id}`}>{formatOrderDate(order.createdAt)}</span>
        </span>
        <span className="ml-auto">
          <StatusPill status={status} />
        </span>
      </header>

      <div className="grid gap-4 p-4 sm:px-5 md:grid-cols-[1fr_220px]">
        {/* LEFT: products + farmer */}
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-sm">
            <Store className="h-4 w-4 text-harvest-moss" />
            <Link
              href="/petani"
              className="font-semibold hover:text-harvest-moss"
              data-testid={`order-farmer-${order.id}`}
            >
              {order.farmerName}
            </Link>
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {order.farmerLocation}
            </span>
            <span className="ml-1 rounded-full bg-harvest-moss/10 px-1.5 py-0.5 text-[10px] font-bold text-harvest-moss">
              Verified
            </span>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/produk/${firstItem.product.id}`}
              className="block h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary"
            >
              <img
                src={firstItem.product.img}
                alt={firstItem.product.name}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/produk/${firstItem.product.id}`}
                className="line-clamp-1 text-sm font-semibold leading-tight hover:text-harvest-moss"
                data-testid={`order-item-name-${order.id}`}
              >
                {firstItem.product.name}
              </Link>
              <p className="text-[11px] text-muted-foreground">
                {firstItem.qty} × {rupiah(firstItem.priceSnap)}
                {firstItem.product.unit}
              </p>
              {restCount > 0 && (
                <p
                  className="mt-1 text-[11px] font-medium text-harvest-moss"
                  data-testid={`order-rest-${order.id}`}
                >
                  +{restCount} produk lainnya
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground">
                Total {totalQty} produk
              </p>
            </div>
          </div>

          {/* Status-specific note */}
          <div className="mt-3 rounded-md bg-secondary/40 p-2.5 text-[11px]">
            {status === "menunggu_pembayaran" && order.paymentDueAt && (
              <p className="inline-flex items-center gap-1.5 text-amber-800">
                <Clock className="h-3.5 w-3.5" />
                Bayar sebelum{" "}
                <span className="font-bold">{formatOrderDate(order.paymentDueAt)}</span>
                {" "} • {order.paymentMethod}
              </p>
            )}
            {status === "diproses_petani" && (
              <p className="inline-flex items-center gap-1.5 text-blue-800">
                <Package className="h-3.5 w-3.5" />
                Petani sedang menyiapkan pesananmu • Dibayar via {order.paymentMethod}
              </p>
            )}
            {status === "dikirim" && (
              <p className="inline-flex flex-wrap items-center gap-1.5 text-violet-800">
                <Truck className="h-3.5 w-3.5" />
                Resi:{" "}
                <span className="font-mono font-bold">{order.trackingNumber}</span>
                {order.estimateArrival && (
                  <>
                    {" "} • Estimasi tiba{" "}
                    <span className="font-semibold">
                      {new Date(order.estimateArrival).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </>
                )}
              </p>
            )}
            {status === "selesai" && (
              <p className="inline-flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Pesanan diterima dengan baik • Dibayar via {order.paymentMethod}
              </p>
            )}
            {status === "dibatalkan" && (
              <p className="inline-flex items-center gap-1.5 text-red-800">
                <XCircle className="h-3.5 w-3.5" />
                {order.cancelReason ?? "Pesanan dibatalkan"}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: total + actions */}
        <div className="flex flex-col gap-2 border-t border-border pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Total Pembayaran
            </p>
            <p
              className="font-serif text-2xl font-bold text-harvest-moss"
              data-testid={`order-total-${order.id}`}
            >
              {rupiah(order.total)}
            </p>
            <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <CreditCard className="h-3 w-3" />
              {order.paymentMethod} · {order.shippingMethod}
            </p>
          </div>

          <div className="mt-auto space-y-1.5">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
              data-testid={`order-detail-btn-${order.id}`}
            >
              <Link href={`/pesanan/${order.id}`}>
                <Eye className="h-4 w-4" /> Lihat Detail
              </Link>
            </Button>

            {status === "menunggu_pembayaran" && (
              <Button
                size="sm"
                className="w-full bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
                data-testid={`order-pay-btn-${order.id}`}
              >
                Bayar Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {status === "dikirim" && (
              <Button
                size="sm"
                className="w-full"
                data-testid={`order-received-btn-${order.id}`}
              >
                <CheckCircle2 className="h-4 w-4" /> Pesanan Diterima
              </Button>
            )}
            {status === "selesai" && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                data-testid={`order-review-btn-${order.id}`}
              >
                <Star className="h-4 w-4" /> Beri Ulasan
              </Button>
            )}
            {(status === "selesai" || status === "dibatalkan") && (
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-muted-foreground"
                data-testid={`order-reorder-btn-${order.id}`}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Beli Lagi
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// =============== PAGE ===============

export default function PesananPage() {
  const allOrders = useMemo(() => getOrders(), []);

  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");

  // Counts per status for tabs
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allOrders.length };
    for (const o of allOrders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [allOrders]);

  const filtered = useMemo(() => {
    let list = allOrders;
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        if (o.id.toLowerCase().includes(q)) return true;
        if (o.farmerName.toLowerCase().includes(q)) return true;
        return o.lines.some((l) => l.product.name.toLowerCase().includes(q));
      });
    }
    // Newest first
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allOrders, filter, search]);

  // Quick aggregate
  const totalSpent = allOrders
    .filter((o) => o.status === "selesai")
    .reduce((s, o) => s + o.total, 0);
  const completedCount = counts.selesai ?? 0;
  const ongoingCount = (counts.diproses_petani ?? 0) + (counts.dikirim ?? 0);

  return (
    <div className="bg-secondary/30">
      {/* BREADCRUMB */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Pesanan Saya</span>
          </nav>
        </div>
      </div>

      <div className="container py-6">
        {/* HEADER + STATS */}
        <header className="mb-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1
              data-testid="page-title"
              className="font-serif text-3xl tracking-tight md:text-4xl"
            >
              Pesanan Saya
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pantau semua pesananmu dari petani favorit
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center md:text-left">
            <div className="rounded-lg border border-border bg-card px-3 py-2.5" data-testid="stat-total-spent">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total Belanja</p>
              <p className="mt-0.5 font-serif text-base font-bold text-harvest-moss">{rupiah(totalSpent)}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-3 py-2.5" data-testid="stat-completed">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Selesai</p>
              <p className="mt-0.5 font-serif text-base font-bold text-foreground">{completedCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-3 py-2.5" data-testid="stat-ongoing">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Berjalan</p>
              <p className="mt-0.5 font-serif text-base font-bold text-amber-600">{ongoingCount}</p>
            </div>
          </div>
        </header>

        {/* TABS + SEARCH */}
        <div className="mb-5 rounded-xl border border-border bg-card p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div
              className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1"
              data-testid="status-tabs"
              role="tablist"
            >
              {FILTERS.map((f) => {
                const active = filter === f.key;
                const count = counts[f.key] ?? 0;
                return (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(f.key)}
                    data-testid={`tab-${f.key}`}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-harvest-moss bg-harvest-moss text-harvest-cream"
                        : "border-border bg-card text-muted-foreground hover:border-harvest-moss/40 hover:text-foreground"
                    )}
                  >
                    {f.key !== "all" && (
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_META[f.key as OrderStatus].dot)} />
                    )}
                    {f.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[10px]",
                        active ? "bg-harvest-cream/20 text-harvest-cream" : "bg-secondary text-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <form
              role="search"
              className="relative md:w-72"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari no. pesanan / produk / petani…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="order-search-input"
                className="h-9 rounded-full pl-10"
              />
            </form>
          </div>
        </div>

        {/* LIST */}
        {filtered.length === 0 ? (
          <div
            data-testid="empty-state"
            className="rounded-xl border border-dashed border-border bg-card p-12 text-center"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-harvest-moss/10">
              <Package className="h-8 w-8 text-harvest-moss" strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-serif text-2xl">Belum ada pesanan di sini</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "all"
                ? "Yuk, mulai belanja hasil tani segar dari petani Indonesia."
                : `Tidak ada pesanan dengan status "${
                    FILTERS.find((f) => f.key === filter)?.label
                  }".`}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {filter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setFilter("all")}
                  data-testid="show-all-btn"
                >
                  Lihat semua pesanan
                </Button>
              )}
              <Button asChild data-testid="shop-now-btn">
                <Link href="/produk">
                  Mulai Belanja
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div
            data-testid="order-list"
            className="space-y-4"
          >
            {filtered.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}

        {/* HELP STRIP */}
        <div
          data-testid="help-strip"
          className="mt-8 rounded-xl border border-border bg-card p-5 text-sm md:flex md:items-center md:justify-between"
        >
          <div>
            <p className="font-semibold">Ada masalah dengan pesanan?</p>
            <p className="text-xs text-muted-foreground">
              Tim support kami siap membantu 24/7 — chat atau hubungi 0800-1234-TANI.
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 md:mt-0">
            <Button asChild variant="outline" size="sm" data-testid="help-chat-btn">
              <Link href="/bantuan">Pusat Bantuan</Link>
            </Button>
            <Button asChild size="sm" data-testid="help-contact-btn">
              <Link href="/kontak">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

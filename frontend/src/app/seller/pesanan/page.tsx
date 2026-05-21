"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ClipboardCheck,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  Printer,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Filter,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { rupiah, PRODUCTS } from "@/lib/products";

// =============== TYPES ===============

type SellerOrderStatus =
  | "pesanan_baru"
  | "diproses"
  | "siap_dikirim"
  | "dikirim"
  | "selesai"
  | "dibatalkan";

const STATUS_META: Record<
  SellerOrderStatus,
  { label: string; tint: string; dot: string; icon: typeof Inbox }
> = {
  pesanan_baru: {
    label: "Pesanan Baru",
    tint: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
    icon: Inbox,
  },
  diproses: {
    label: "Diproses",
    tint: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
    icon: ClipboardCheck,
  },
  siap_dikirim: {
    label: "Siap Dikirim",
    tint: "bg-indigo-100 text-indigo-800 border-indigo-300",
    dot: "bg-indigo-500",
    icon: PackageCheck,
  },
  dikirim: {
    label: "Dikirim",
    tint: "bg-violet-100 text-violet-800 border-violet-300",
    dot: "bg-violet-500",
    icon: Truck,
  },
  selesai: {
    label: "Selesai",
    tint: "bg-emerald-100 text-emerald-800 border-emerald-300",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  dibatalkan: {
    label: "Dibatalkan",
    tint: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const NEXT_ACTION: Record<
  SellerOrderStatus,
  { label: string; nextStatus: SellerOrderStatus | null } | null
> = {
  pesanan_baru: { label: "Terima Pesanan", nextStatus: "diproses" },
  diproses: { label: "Tandai Siap Dikirim", nextStatus: "siap_dikirim" },
  siap_dikirim: { label: "Kirim Pesanan", nextStatus: "dikirim" },
  dikirim: { label: "Tandai Selesai", nextStatus: "selesai" },
  selesai: null,
  dibatalkan: null,
};

interface SellerOrderItem {
  productId: string;
  qty: number;
  priceSnap: number;
}

interface SellerOrder {
  id: string;
  createdAt: string;
  status: SellerOrderStatus;
  buyer: { name: string; city: string; phone: string };
  items: SellerOrderItem[];
  shippingMethod: "Reguler" | "Same Day" | "Pickup";
  shippingFee: number;
  serviceFee: number;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
}

// Dummy seller orders covering all 6 statuses
const SEED_ORDERS: SellerOrder[] = [
  {
    id: "GH-2026000825",
    createdAt: "2026-01-19T08:14:00Z",
    status: "pesanan_baru",
    buyer: { name: "Rizki Pratama", city: "Jakarta Selatan", phone: "0812-3456-7890" },
    items: [
      { productId: "p01", qty: 3, priceSnap: 18000 },
      { productId: "p17", qty: 2, priceSnap: 16000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer BCA",
    notes: "Tolong dipack rapi, untuk hadiah Bunda",
  },
  {
    id: "GH-2026000823",
    createdAt: "2026-01-19T07:42:00Z",
    status: "pesanan_baru",
    buyer: { name: "Sari Wulandari", city: "Bandung", phone: "0813-1111-2222" },
    items: [
      { productId: "p22", qty: 4, priceSnap: 14000 },
      { productId: "p08", qty: 2, priceSnap: 12000 },
    ],
    shippingMethod: "Same Day",
    shippingFee: 25000,
    serviceFee: 2500,
    paymentMethod: "GoPay",
  },
  {
    id: "GH-2026000820",
    createdAt: "2026-01-18T19:20:00Z",
    status: "diproses",
    buyer: { name: "Budi Hartono", city: "Depok", phone: "0814-9999-1234" },
    items: [{ productId: "p07", qty: 6, priceSnap: 15000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "QRIS",
  },
  {
    id: "GH-2026000818",
    createdAt: "2026-01-18T15:05:00Z",
    status: "diproses",
    buyer: { name: "Andi Saputra", city: "Tangerang", phone: "0815-7777-8888" },
    items: [
      { productId: "p01", qty: 5, priceSnap: 18000 },
      { productId: "p29", qty: 1, priceSnap: 24000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer Mandiri",
  },
  {
    id: "GH-2026000816",
    createdAt: "2026-01-18T11:33:00Z",
    status: "siap_dikirim",
    buyer: { name: "Lina Marlina", city: "Bekasi", phone: "0816-2222-3333" },
    items: [{ productId: "p17", qty: 3, priceSnap: 16000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "OVO",
  },
  {
    id: "GH-2026000812",
    createdAt: "2026-01-17T16:18:00Z",
    status: "dikirim",
    buyer: { name: "Rahmat Hidayat", city: "Cibubur", phone: "0817-5555-6666" },
    items: [{ productId: "p22", qty: 8, priceSnap: 14000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Dana",
    trackingNumber: "JNE-918273645",
  },
  {
    id: "GH-2026000808",
    createdAt: "2026-01-16T14:00:00Z",
    status: "dikirim",
    buyer: { name: "Dewi Anggraini", city: "Bogor", phone: "0818-3333-4444" },
    items: [
      { productId: "p07", qty: 2, priceSnap: 15000 },
      { productId: "p08", qty: 3, priceSnap: 12000 },
    ],
    shippingMethod: "Same Day",
    shippingFee: 25000,
    serviceFee: 2500,
    paymentMethod: "ShopeePay",
    trackingNumber: "GOSEND-22938475",
  },
  {
    id: "GH-2026000801",
    createdAt: "2026-01-15T09:45:00Z",
    status: "selesai",
    buyer: { name: "Citra Lestari", city: "Jakarta Pusat", phone: "0819-1212-3434" },
    items: [{ productId: "p01", qty: 2, priceSnap: 18000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer BNI",
  },
  {
    id: "GH-2026000795",
    createdAt: "2026-01-14T08:30:00Z",
    status: "selesai",
    buyer: { name: "Eko Prasetyo", city: "Tangerang Selatan", phone: "0820-7878-9090" },
    items: [
      { productId: "p22", qty: 2, priceSnap: 14000 },
      { productId: "p17", qty: 1, priceSnap: 16000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "COD",
  },
  {
    id: "GH-2026000788",
    createdAt: "2026-01-12T17:55:00Z",
    status: "dibatalkan",
    buyer: { name: "Fajar Nugroho", city: "Cikarang", phone: "0821-4545-6767" },
    items: [{ productId: "p01", qty: 1, priceSnap: 18000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer BRI",
    notes: "Dibatalkan: pembeli tidak menyelesaikan pembayaran",
  },
];

// =============== HELPERS ===============

function StatusPill({ status }: { status: SellerOrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      data-testid={`status-pill-${status}`}
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hydrateItems(items: SellerOrderItem[]) {
  return items.map((it) => {
    const product = PRODUCTS.find((p) => p.id === it.productId);
    return { ...it, product, subtotal: it.priceSnap * it.qty };
  });
}

function computeTotal(o: SellerOrder) {
  const sub = o.items.reduce((s, x) => s + x.priceSnap * x.qty, 0);
  return sub + o.shippingFee + o.serviceFee;
}

const FILTERS: { key: "all" | SellerOrderStatus; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pesanan_baru", label: "Pesanan Baru" },
  { key: "diproses", label: "Diproses" },
  { key: "siap_dikirim", label: "Siap Dikirim" },
  { key: "dikirim", label: "Dikirim" },
  { key: "selesai", label: "Selesai" },
  { key: "dibatalkan", label: "Dibatalkan" },
];

const PAGE_SIZE = 6;

// =============== PAGE ===============

export default function SellerPesananPage() {
  const [orders, setOrders] = useState<SellerOrder[]>(SEED_ORDERS);
  const [filter, setFilter] = useState<"all" | SellerOrderStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter !== "all") list = list.filter((o) => o.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.buyer.name.toLowerCase().includes(q) ||
          o.items.some((it) => {
            const p = PRODUCTS.find((pp) => pp.id === it.productId);
            return p && p.name.toLowerCase().includes(q);
          })
      );
    }
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Mutations
  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = NEXT_ACTION[o.status];
        if (!next || !next.nextStatus) return o;
        let trackingNumber = o.trackingNumber;
        if (next.nextStatus === "dikirim" && !trackingNumber) {
          const resi = prompt(
            `Masukkan nomor resi untuk pesanan ${o.id}:`,
            "JNE-"
          );
          if (!resi) return o;
          trackingNumber = resi.trim();
        }
        return { ...o, status: next.nextStatus, trackingNumber };
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    const reason = prompt("Alasan pembatalan? (opsional)");
    if (reason === null) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "dibatalkan",
              notes: reason
                ? `Dibatalkan: ${reason}`
                : "Dibatalkan oleh petani",
            }
          : o
      )
    );
  };

  // Aggregate stats
  const totalRevenue = orders
    .filter((o) => o.status === "selesai")
    .reduce((s, o) => s + computeTotal(o), 0);
  const newCount = counts.pesanan_baru ?? 0;
  const onProgress =
    (counts.diproses ?? 0) + (counts.siap_dikirim ?? 0) + (counts.dikirim ?? 0);

  return (
    <div data-testid="seller-pesanan-page" className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-harvest-gold">
            Operasi Toko
          </p>
          <h1
            data-testid="page-title"
            className="mt-1 font-serif text-3xl tracking-tight md:text-4xl"
          >
            Kelola Pesanan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Konfirmasi pesanan baru, packing, dan kirim ke pembeli secepatnya.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" data-testid="print-all-btn">
            <Printer className="h-4 w-4" />
            Cetak Packing Slip
          </Button>
        </div>
      </header>

      {/* Quick stats */}
      <section
        data-testid="quick-stats"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: "Pesanan Baru",
            value: newCount,
            icon: Inbox,
            tint: "bg-amber-100 text-amber-700",
            highlight: newCount > 0,
          },
          {
            label: "Sedang Berjalan",
            value: onProgress,
            icon: Truck,
            tint: "bg-blue-100 text-blue-700",
          },
          {
            label: "Selesai (Total)",
            value: counts.selesai ?? 0,
            icon: CheckCircle2,
            tint: "bg-emerald-100 text-emerald-700",
          },
          {
            label: "Pendapatan",
            value: rupiah(totalRevenue),
            icon: Calendar,
            tint: "bg-harvest-moss/10 text-harvest-moss",
          },
        ].map((s) => (
          <div
            key={s.label}
            data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card p-4",
              s.highlight ? "border-amber-300 ring-2 ring-amber-200" : "border-border"
            )}
          >
            <span className={cn("grid h-10 w-10 place-items-center rounded-md", s.tint)}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="font-serif text-xl font-bold md:text-2xl">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Tabs + toolbar */}
      <section className="rounded-xl border border-border bg-card">
        <div
          className="flex overflow-x-auto border-b border-border"
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
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                data-testid={`tab-${f.key}`}
                className={cn(
                  "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                  active ? "text-harvest-moss" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.key !== "all" && (
                  <span
                    className={cn(
                      "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                      STATUS_META[f.key as SellerOrderStatus].dot
                    )}
                  />
                )}
                {f.label}
                <span className="ml-1 rounded-full bg-secondary px-1.5 text-[10px] font-bold">
                  {count}
                </span>
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-harvest-moss" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3">
          <form
            role="search"
            className="relative flex-1 min-w-[200px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari no. pesanan, pembeli, atau produk…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              data-testid="search-input"
              className="h-9 pl-10"
            />
          </form>
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch("")}
              data-testid="clear-search-btn"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Order list */}
        {visible.length === 0 ? (
          <div
            data-testid="empty-state"
            className="border-t border-border p-12 text-center"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-harvest-moss/10">
              <Inbox className="h-8 w-8 text-harvest-moss" strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-serif text-2xl">Belum ada pesanan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter !== "all"
                ? `Tidak ada pesanan dengan status "${
                    FILTERS.find((x) => x.key === filter)?.label
                  }".`
                : "Pesanan dari pembeli akan muncul di sini."}
            </p>
            {filter !== "all" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter("all")}
                data-testid="show-all-btn"
              >
                Lihat Semua Pesanan
              </Button>
            )}
          </div>
        ) : (
          <ul
            className="divide-y divide-border"
            data-testid="order-list"
          >
            {visible.map((o) => {
              const items = hydrateItems(o.items);
              const total = computeTotal(o);
              const action = NEXT_ACTION[o.status];
              const canCancel =
                o.status === "pesanan_baru" || o.status === "diproses";
              const isExpanded = expanded === o.id;
              const totalQty = o.items.reduce((s, x) => s + x.qty, 0);

              return (
                <li
                  key={o.id}
                  data-testid={`order-row-${o.id}`}
                  className="p-4 md:p-5"
                >
                  {/* Top strip */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <StatusPill status={o.status} />
                    <span className="font-mono font-bold">{o.id}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(o.createdAt)}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
                      {o.paymentMethod} · {o.shippingMethod}
                    </span>
                  </div>

                  <Separator className="my-3" />

                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                    {/* LEFT: buyer + products */}
                    <div className="space-y-3">
                      {/* Buyer */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-harvest-moss/10 font-semibold text-harvest-moss">
                          {o.buyer.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            data-testid={`buyer-name-${o.id}`}
                            className="text-sm font-semibold leading-tight"
                          >
                            {o.buyer.name}
                          </p>
                          <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {o.buyer.city}
                            <span className="mx-1">·</span>
                            {o.buyer.phone}
                          </p>
                        </div>
                        <div className="ml-auto flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Telepon pembeli"
                            data-testid={`call-buyer-${o.id}`}
                            className="h-8 w-8"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Chat pembeli"
                            data-testid={`chat-buyer-${o.id}`}
                            className="h-8 w-8"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 rounded-md bg-secondary/40 p-3">
                        {items.slice(0, isExpanded ? items.length : 2).map((it) => (
                          <div
                            key={it.productId}
                            className="flex items-center gap-3"
                            data-testid={`item-${o.id}-${it.productId}`}
                          >
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-card">
                              {it.product && (
                                <img
                                  src={it.product.img}
                                  alt={it.product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="line-clamp-1 text-sm font-medium">
                                {it.product?.name ?? it.productId}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                <span data-testid={`qty-${o.id}-${it.productId}`} className="font-semibold text-foreground">
                                  {it.qty}
                                </span>{" "}
                                × {rupiah(it.priceSnap)}
                                {it.product?.unit}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-harvest-moss">
                              {rupiah(it.subtotal)}
                            </span>
                          </div>
                        ))}
                        {items.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : o.id)}
                            data-testid={`expand-items-${o.id}`}
                            className="text-[11px] font-semibold text-harvest-moss hover:underline"
                          >
                            {isExpanded
                              ? "Sembunyikan"
                              : `+${items.length - 2} produk lain · ${totalQty} total qty`}
                          </button>
                        )}
                      </div>

                      {/* Notes / tracking */}
                      {o.notes && (
                        <p
                          data-testid={`notes-${o.id}`}
                          className="rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-900"
                        >
                          📝 {o.notes}
                        </p>
                      )}
                      {o.trackingNumber && (
                        <p className="inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-3 py-2 text-[11px] text-violet-900">
                          <Truck className="h-3 w-3" />
                          Resi:{" "}
                          <span className="font-mono font-bold">{o.trackingNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* RIGHT: total + actions */}
                    <div className="flex flex-col gap-2 md:items-end md:w-56">
                      <div className="w-full text-right">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          Total Pesanan
                        </p>
                        <p
                          data-testid={`total-${o.id}`}
                          className="font-serif text-2xl font-bold text-harvest-moss"
                        >
                          {rupiah(total)}
                        </p>
                      </div>

                      <div className="w-full space-y-1.5">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full"
                          data-testid={`view-${o.id}`}
                        >
                          <Link href={`/seller/pesanan/${o.id}`}>
                            <Eye className="h-4 w-4" /> Lihat Detail
                          </Link>
                        </Button>

                        {action && (
                          <Button
                            size="sm"
                            className="w-full bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
                            onClick={() => advanceStatus(o.id)}
                            data-testid={`advance-${o.id}`}
                          >
                            {action.label}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                        {o.status === "siap_dikirim" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            data-testid={`print-${o.id}`}
                          >
                            <Printer className="h-4 w-4" />
                            Cetak Label
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => cancelOrder(o.id)}
                            data-testid={`cancel-${o.id}`}
                            className="w-full text-muted-foreground hover:text-harvest-chili"
                          >
                            <XCircle className="h-4 w-4" />
                            Batalkan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm"
            data-testid="pagination"
          >
            <p className="text-xs text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">
                {(safePage - 1) * PAGE_SIZE + 1}–
                {(safePage - 1) * PAGE_SIZE + visible.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span> pesanan
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
                data-testid="pagination-prev"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    data-testid={`pagination-page-${n}`}
                    className={cn(
                      "h-8 min-w-8 rounded-md border px-2 text-xs font-semibold",
                      n === safePage
                        ? "border-harvest-moss bg-harvest-moss text-harvest-cream"
                        : "border-border hover:border-harvest-moss/40"
                    )}
                  >
                    {n}
                  </button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={safePage === totalPages}
                onClick={() => setPage(safePage + 1)}
                data-testid="pagination-next"
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

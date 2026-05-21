"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  PackageX,
  Archive,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Copy,
  TrendingUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  PRODUCTS,
  CATEGORY_LABELS,
  rupiah,
  type Product,
  type ProductCategory,
} from "@/lib/products";

// ============== TYPES ==============

type ProductStatus = "aktif" | "habis" | "draft" | "arsip";

interface SellerProduct {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  stock: number;
  status: ProductStatus;
  sold: number;
  rating: number;
  img: string;
  updatedAt: string;
}

const STATUS_META: Record<
  ProductStatus,
  { label: string; tint: string; dot: string }
> = {
  aktif: {
    label: "Aktif",
    tint: "bg-emerald-100 text-emerald-800 border-emerald-300",
    dot: "bg-emerald-500",
  },
  habis: {
    label: "Stok Habis",
    tint: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-500",
  },
  draft: {
    label: "Draft",
    tint: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
  },
  arsip: {
    label: "Diarsipkan",
    tint: "bg-stone-100 text-stone-700 border-stone-300",
    dot: "bg-stone-400",
  },
};

// Mock seller's products — pull a curated subset from PRODUCTS + add seller-specific fields
const SEED: { srcId: string; status: ProductStatus; stock: number; updatedAt: string }[] = [
  { srcId: "p01", status: "aktif", stock: 62, updatedAt: "2026-01-18T08:00:00Z" },
  { srcId: "p05", status: "aktif", stock: 24, updatedAt: "2026-01-17T15:00:00Z" },
  { srcId: "p07", status: "aktif", stock: 110, updatedAt: "2026-01-17T10:00:00Z" },
  { srcId: "p08", status: "aktif", stock: 18, updatedAt: "2026-01-16T11:00:00Z" },
  { srcId: "p17", status: "aktif", stock: 0, updatedAt: "2026-01-16T09:00:00Z" }, // will become habis
  { srcId: "p22", status: "aktif", stock: 41, updatedAt: "2026-01-15T17:00:00Z" },
  { srcId: "p29", status: "aktif", stock: 0, updatedAt: "2026-01-15T13:00:00Z" }, // will become habis
  { srcId: "p02", status: "aktif", stock: 86, updatedAt: "2026-01-14T08:00:00Z" },
  { srcId: "p11", status: "draft", stock: 12, updatedAt: "2026-01-12T16:00:00Z" },
  { srcId: "p10", status: "aktif", stock: 5, updatedAt: "2026-01-11T08:00:00Z" }, // low stock warning
  { srcId: "p25", status: "arsip", stock: 0, updatedAt: "2026-01-08T11:00:00Z" },
  { srcId: "p15", status: "aktif", stock: 47, updatedAt: "2026-01-07T14:00:00Z" },
  { srcId: "p28", status: "draft", stock: 8, updatedAt: "2026-01-05T10:00:00Z" },
  { srcId: "p23", status: "aktif", stock: 32, updatedAt: "2026-01-04T09:00:00Z" },
];

function buildInitialProducts(): SellerProduct[] {
  return SEED.map((s, i) => {
    const src = PRODUCTS.find((p) => p.id === s.srcId)!;
    const status: ProductStatus = s.stock === 0 && s.status === "aktif" ? "habis" : s.status;
    return {
      id: src.id,
      sku: `SKU-${String(1000 + i).padStart(4, "0")}`,
      name: src.name,
      category: src.category,
      price: src.price,
      unit: src.unit,
      stock: s.stock,
      status,
      sold: src.sold,
      rating: src.rating,
      img: src.img,
      updatedAt: s.updatedAt,
    };
  });
}

const PAGE_SIZE = 8;

// ============== HELPERS ==============

function StatusPill({ status }: { status: ProductStatus }) {
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

function StockChip({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="text-sm font-bold text-harvest-chili">0</span>;
  if (stock < 10)
    return (
      <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
        {stock}
        <span className="rounded bg-amber-100 px-1 text-[9px] font-bold uppercase">
          Rendah
        </span>
      </span>
    );
  return <span className="text-sm font-semibold">{stock}</span>;
}

function formatUpdated(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ============== PAGE ==============

export default function SellerProdukPage() {
  const [products, setProducts] = useState<SellerProduct[]>(buildInitialProducts);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const toggleCategory = (c: ProductCategory) => {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setCategories([]);
    setStatusFilter("all");
    setPage(1);
  };

  // Stats (computed from ALL products, not just filtered)
  const stats = useMemo(() => {
    const total = products.length;
    const aktif = products.filter((p) => p.status === "aktif").length;
    const habis = products.filter((p) => p.status === "habis").length;
    const draft = products.filter((p) => p.status === "draft").length;
    const arsip = products.filter((p) => p.status === "arsip").length;
    const lowStock = products.filter((p) => p.status === "aktif" && p.stock < 10).length;
    return { total, aktif, habis, draft, arsip, lowStock };
  }, [products]);

  // Status tab counts
  const statusCounts: Record<string, number> = {
    all: stats.total,
    aktif: stats.aktif,
    habis: stats.habis,
    draft: stats.draft,
    arsip: stats.arsip,
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (q && !`${p.name} ${p.sku}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, statusFilter, categories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allOnPageSelected =
    visible.length > 0 && visible.every((p) => selected.has(p.id));

  const togglePageSelection = () => {
    setSelected((s) => {
      const next = new Set(s);
      if (allOnPageSelected) {
        visible.forEach((p) => next.delete(p.id));
      } else {
        visible.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  // Mutations
  const handleDelete = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (confirm(`Hapus produk "${p.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      setProducts((prev) => prev.filter((x) => x.id !== id));
      setSelected((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDuplicate = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const newId = `${p.id}-dup-${Date.now()}`;
    setProducts((prev) => [
      {
        ...p,
        id: newId,
        sku: `${p.sku}-COPY`,
        name: `${p.name} (Salinan)`,
        status: "draft",
        sold: 0,
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleArchive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "arsip" ? "aktif" : "arsip" }
          : p
      )
    );
  };

  const bulkDelete = () => {
    if (selected.size === 0) return;
    if (confirm(`Hapus ${selected.size} produk yang dipilih?`)) {
      setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
      setSelected(new Set());
    }
  };
  const bulkArchive = () => {
    if (selected.size === 0) return;
    setProducts((prev) =>
      prev.map((p) => (selected.has(p.id) ? { ...p, status: "arsip" } : p))
    );
    setSelected(new Set());
  };

  const activeFilterCount = (search ? 1 : 0) + categories.length + (statusFilter !== "all" ? 1 : 0);

  return (
    <div data-testid="seller-produk-page" className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-harvest-gold">
            Kelola Toko
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl" data-testid="page-title">
            Kelola Produk
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur produk, stok, dan harga untuk seluruh hasil panen toko-mu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            data-testid="import-btn"
            className="border-harvest-moss/40 text-harvest-moss"
          >
            <Link href="/seller/produk/import">
              <FileText className="h-4 w-4" />
              Import CSV
            </Link>
          </Button>
          <Button
            asChild
            data-testid="add-product-btn"
            className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
          >
            <Link href="/seller/produk/baru">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>
      </header>

      {/* Stats strip */}
      <section
        data-testid="produk-stats"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Total Produk", value: stats.total, icon: Package, tint: "text-harvest-moss bg-harvest-moss/10" },
          { label: "Stok Habis", value: stats.habis, icon: PackageX, tint: "text-harvest-chili bg-harvest-chili/10" },
          { label: "Stok Rendah (<10)", value: stats.lowStock, icon: TrendingUp, tint: "text-amber-700 bg-amber-100" },
          { label: "Draft / Belum Publish", value: stats.draft, icon: FileText, tint: "text-blue-700 bg-blue-100" },
        ].map((s) => (
          <div
            key={s.label}
            data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
          >
            <span className={cn("grid h-10 w-10 place-items-center rounded-md", s.tint)}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="font-serif text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Status tabs + filters card */}
      <section className="rounded-xl border border-border bg-card">
        {/* Status tabs */}
        <div className="flex overflow-x-auto border-b border-border" data-testid="status-tabs" role="tablist">
          {(["all", "aktif", "habis", "draft", "arsip"] as const).map((k) => {
            const active = statusFilter === k;
            const label = k === "all" ? "Semua" : STATUS_META[k as ProductStatus].label;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setStatusFilter(k);
                  setPage(1);
                }}
                data-testid={`status-tab-${k}`}
                className={cn(
                  "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                  active ? "text-harvest-moss" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}{" "}
                <span className="ml-1 rounded-full bg-secondary px-1.5 text-[10px] font-bold">
                  {statusCounts[k]}
                </span>
                {active && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-harvest-moss" />}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3">
          <form role="search" className="relative flex-1 min-w-[200px]" onSubmit={(e) => e.preventDefault()}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari nama atau SKU produk…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              data-testid="search-input"
              className="h-9 pl-10"
            />
          </form>

          <div className="flex items-center gap-1 overflow-x-auto" data-testid="category-filter-chips">
            <span className="hidden text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
              Kategori:
            </span>
            {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((c) => {
              const active = categories.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCategory(c)}
                  data-testid={`cat-chip-${c}`}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                    active
                      ? "border-harvest-moss bg-harvest-moss text-harvest-cream"
                      : "border-border bg-card hover:border-harvest-moss/40"
                  )}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              );
            })}
          </div>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              data-testid="reset-filters-btn"
              className="text-harvest-chili"
            >
              <X className="h-3.5 w-3.5" />
              Reset ({activeFilterCount})
            </Button>
          )}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div
            data-testid="bulk-actions"
            className="flex flex-wrap items-center gap-2 border-t border-border bg-harvest-moss/5 px-4 py-2.5 text-sm"
          >
            <span className="font-medium text-harvest-moss">
              {selected.size} produk dipilih
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Button size="sm" variant="outline" onClick={bulkArchive} data-testid="bulk-archive-btn">
              <Archive className="h-4 w-4" /> Arsipkan
            </Button>
            <Button size="sm" variant="outline" onClick={bulkDelete} className="text-harvest-chili" data-testid="bulk-delete-btn">
              <Trash2 className="h-4 w-4" /> Hapus
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelected(new Set())}
              className="ml-auto text-muted-foreground"
              data-testid="bulk-clear-btn"
            >
              Batal pilih
            </Button>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm" data-testid="product-table">
            <thead>
              <tr className="border-t border-border bg-secondary/30 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={togglePageSelection}
                    aria-label="Pilih semua di halaman ini"
                    data-testid="select-all-page"
                    className="h-4 w-4 accent-harvest-moss"
                  />
                </th>
                <th className="py-3 font-semibold">Produk</th>
                <th className="py-3 font-semibold">Kategori</th>
                <th className="py-3 font-semibold">Harga</th>
                <th className="py-3 font-semibold">Stok</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Terjual</th>
                <th className="py-3 font-semibold">Update</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-harvest-moss/10">
                      <Package className="h-7 w-7 text-harvest-moss" strokeWidth={1.5} />
                    </div>
                    <p className="mt-3 font-serif text-xl">Tidak ada produk yang cocok</p>
                    <p className="text-xs text-muted-foreground">
                      Coba ubah filter atau tambah produk baru.
                    </p>
                    <div className="mt-3 flex justify-center gap-2">
                      {activeFilterCount > 0 && (
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                          Reset Filter
                        </Button>
                      )}
                      <Button asChild size="sm">
                        <Link href="/seller/produk/baru">
                          <Plus className="h-4 w-4" />
                          Tambah Produk
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((p) => (
                  <tr
                    key={p.id}
                    data-testid={`product-row-${p.id}`}
                    className="border-t border-border/60 transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() =>
                          setSelected((s) => {
                            const next = new Set(s);
                            if (next.has(p.id)) next.delete(p.id);
                            else next.add(p.id);
                            return next;
                          })
                        }
                        aria-label={`Pilih ${p.name}`}
                        className="h-4 w-4 accent-harvest-moss"
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                          <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/produk/${p.id.split("-")[0]}`}
                            data-testid={`product-name-link-${p.id}`}
                            className="line-clamp-1 text-sm font-semibold hover:text-harvest-moss"
                          >
                            {p.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-xs">
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-medium">
                        {CATEGORY_LABELS[p.category]}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-harvest-moss">{rupiah(p.price)}</p>
                      <p className="text-[10px] text-muted-foreground">{p.unit}</p>
                    </td>
                    <td className="py-3">
                      <StockChip stock={p.stock} />
                    </td>
                    <td className="py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="py-3 text-sm font-semibold">
                      {p.sold >= 1000 ? `${(p.sold / 1000).toFixed(1)}rb` : p.sold}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {formatUpdated(p.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          aria-label="Pratinjau"
                          data-testid={`preview-${p.id}`}
                        >
                          <Link href={`/produk/${p.id.split("-")[0]}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          aria-label="Edit"
                          data-testid={`edit-${p.id}`}
                        >
                          <Link href={`/seller/produk/${p.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Duplikasi"
                          data-testid={`duplicate-${p.id}`}
                          onClick={() => handleDuplicate(p.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Arsipkan"
                          data-testid={`archive-${p.id}`}
                          onClick={() => handleArchive(p.id)}
                          className={cn(p.status === "arsip" && "text-harvest-moss")}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Hapus"
                          data-testid={`delete-${p.id}`}
                          onClick={() => handleDelete(p.id)}
                          className="text-muted-foreground hover:text-harvest-chili"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-border md:hidden" data-testid="product-cards-mobile">
          {visible.length === 0 && (
            <li className="p-8 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-3 font-serif text-lg">Tidak ada produk</p>
              <p className="text-xs text-muted-foreground">Reset filter atau tambah produk baru.</p>
            </li>
          )}
          {visible.map((p) => (
            <li
              key={p.id}
              data-testid={`product-card-mobile-${p.id}`}
              className="p-4"
            >
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() =>
                    setSelected((s) => {
                      const next = new Set(s);
                      if (next.has(p.id)) next.delete(p.id);
                      else next.add(p.id);
                      return next;
                    })
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-harvest-moss"
                />
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/produk/${p.id.split("-")[0]}`}
                      className="line-clamp-2 text-sm font-semibold hover:text-harvest-moss"
                    >
                      {p.name}
                    </Link>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {p.sku} · {CATEGORY_LABELS[p.category]}
                  </p>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-bold text-harvest-moss">{rupiah(p.price)}</span>
                    <span className="text-[11px] text-muted-foreground">{p.unit}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>
                      Stok: <StockChip stock={p.stock} />
                    </span>
                    <span>·</span>
                    <span>
                      Terjual: <span className="font-semibold text-foreground">{p.sold}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <Button asChild size="sm" variant="outline" data-testid={`mobile-edit-${p.id}`}>
                  <Link href={`/seller/produk/${p.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleArchive(p.id)}
                  data-testid={`mobile-archive-${p.id}`}
                >
                  <Archive className="h-3.5 w-3.5" /> Arsip
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(p.id)}
                  className="text-harvest-chili"
                  data-testid={`mobile-delete-${p.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm" data-testid="pagination">
            <p className="text-xs text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">
                {(safePage - 1) * PAGE_SIZE + 1}–
                {(safePage - 1) * PAGE_SIZE + visible.length}
              </span>{" "}
              dari <span className="font-semibold text-foreground">{filtered.length}</span> produk
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

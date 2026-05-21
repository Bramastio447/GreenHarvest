"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  ShoppingCart,
  ChevronRight,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  PRODUCTS,
  LOCATIONS,
  CATEGORY_LABELS,
  rupiah,
  type Product,
  type ProductCategory,
} from "@/lib/products";

type SortKey = "terbaru" | "termurah" | "terlaris";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Termurah" },
  { value: "terlaris", label: "Terlaris" },
];

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][];

function FilterSidebar({
  categories,
  toggleCategory,
  locations,
  toggleLocation,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  reset,
  activeCount,
}: {
  categories: ProductCategory[];
  toggleCategory: (c: ProductCategory) => void;
  locations: string[];
  toggleLocation: (l: string) => void;
  priceMin: string;
  priceMax: string;
  setPriceMin: (v: string) => void;
  setPriceMax: (v: string) => void;
  reset: () => void;
  activeCount: number;
}) {
  return (
    <aside data-testid="filter-sidebar" className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg">Filter</h3>
        {activeCount > 0 && (
          <button
            onClick={reset}
            data-testid="filter-reset-btn"
            className="text-xs font-medium text-harvest-chili hover:underline"
          >
            Reset ({activeCount})
          </button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Kategori
        </h4>
        <ul className="space-y-2">
          {CATEGORIES.map(([key, label]) => {
            const active = categories.includes(key);
            return (
              <li key={key}>
                <label
                  className="flex cursor-pointer items-center gap-2"
                  data-testid={`filter-cat-${key}`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCategory(key)}
                    className="h-4 w-4 accent-harvest-moss"
                  />
                  <span className={cn(active && "font-semibold text-harvest-moss")}>
                    {label}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Rentang Harga (Rp)
        </h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            data-testid="filter-price-min"
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            data-testid="filter-price-max"
            className="h-9"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            ["< 20rb", "", "20000"],
            ["20–50rb", "20000", "50000"],
            ["50–100rb", "50000", "100000"],
            ["> 100rb", "100000", ""],
          ].map(([label, lo, hi]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setPriceMin(lo);
                setPriceMax(hi);
              }}
              data-testid={`filter-price-preset-${label}`}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] hover:border-harvest-moss/40 hover:text-harvest-moss"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Lokasi Petani
        </h4>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-1">
          {LOCATIONS.map((loc) => {
            const active = locations.includes(loc);
            return (
              <li key={loc}>
                <label
                  className="flex cursor-pointer items-center gap-2"
                  data-testid={`filter-loc-${loc.toLowerCase()}`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleLocation(loc)}
                    className="h-4 w-4 accent-harvest-moss"
                  />
                  <span className={cn(active && "font-semibold text-harvest-moss")}>
                    {loc}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

function ProductCard({ p }: { p: Product }) {
  const badgeStyle =
    p.badge === "promo"
      ? "bg-harvest-chili text-white"
      : p.badge === "terlaris"
        ? "bg-harvest-gold text-harvest-soil"
        : "bg-harvest-leaf text-white";
  const badgeLabel =
    p.badge === "promo" ? "PROMO" : p.badge === "terlaris" ? "TERLARIS" : "BARU";

  return (
    <article
      data-testid={`product-card-${p.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <Link href={`/produk/${p.id}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <img
          src={p.img}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {p.badge && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold shadow",
              badgeStyle
            )}
          >
            {badgeLabel}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-semibold">
          <Link
            href={`/produk/${p.id}`}
            className="transition-colors hover:text-harvest-moss"
            data-testid={`product-link-${p.id}`}
          >
            {p.name}
          </Link>
        </h3>
        <p className="line-clamp-1 text-[11px] text-muted-foreground">{p.farmer}</p>

        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-base font-bold text-harvest-moss">
            {rupiah(p.price)}
          </span>
          <span className="text-[11px] text-muted-foreground">{p.unit}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-harvest-gold text-harvest-gold" />
            <span className="font-semibold text-foreground">{p.rating}</span>
          </span>
          <span>·</span>
          <span>{p.sold >= 1000 ? `${(p.sold / 1000).toFixed(1)}rb` : p.sold} terjual</span>
        </div>

        <p className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {p.location}
        </p>

        <Button
          size="sm"
          className="mt-3 w-full gap-1.5"
          data-testid={`add-to-cart-${p.id}`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Tambah ke Keranjang
        </Button>
      </div>
    </article>
  );
}

export default function ProdukPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("terbaru");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const toggleCategory = (c: ProductCategory) =>
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  const toggleLocation = (l: string) =>
    setLocations((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );

  const reset = () => {
    setCategories([]);
    setLocations([]);
    setPriceMin("");
    setPriceMax("");
    setSearch("");
  };

  const filtered = useMemo(() => {
    const min = priceMin ? Number(priceMin) : -Infinity;
    const max = priceMax ? Number(priceMax) : Infinity;
    const q = search.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (categories.length && !categories.includes(p.category)) return false;
      if (locations.length && !locations.includes(p.location)) return false;
      if (p.price < min || p.price > max) return false;
      if (q && !`${p.name} ${p.farmer}`.toLowerCase().includes(q)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === "termurah") return a.price - b.price;
      if (sort === "terlaris") return b.sold - a.sold;
      return a.createdAt - b.createdAt; // lower = newer
    });

    return list;
  }, [categories, locations, priceMin, priceMax, search, sort]);

  const visible = filtered.slice(0, page * pageSize);
  const hasMore = visible.length < filtered.length;
  const activeFilterCount =
    categories.length +
    locations.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const sidebarProps = {
    categories,
    toggleCategory,
    locations,
    toggleLocation,
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    reset,
    activeCount: activeFilterCount,
  };

  return (
    <div className="bg-secondary/30">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Semua Produk</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1
                data-testid="page-title"
                className="font-serif text-3xl tracking-tight md:text-4xl"
              >
                Semua Produk Hasil Tani
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ditemukan{" "}
                <span data-testid="result-count" className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                produk dari petani Indonesia
              </p>
            </div>

            {/* Search */}
            <form
              role="search"
              data-testid="produk-search-form"
              className="relative w-full max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari produk atau nama petani…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                data-testid="produk-search-input"
                className="h-11 rounded-full border-harvest-moss/30 bg-background pl-10"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-32 rounded-xl border border-border bg-card p-5">
            <FilterSidebar {...sidebarProps} />
          </div>
        </div>

        {/* Main */}
        <div>
          {/* Sort + mobile filter row */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    data-testid="mobile-filter-trigger"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="ml-1 rounded-full bg-harvest-moss px-1.5 text-[10px] font-bold text-harvest-cream">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <h2 className="mb-4 font-serif text-2xl">Filter Produk</h2>
                  <FilterSidebar {...sidebarProps} />
                </SheetContent>
              </Sheet>

              {/* Active filter pills */}
              <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCategory(c)}
                    data-testid={`active-pill-cat-${c}`}
                    className="inline-flex items-center gap-1 rounded-full bg-harvest-moss/10 px-2.5 py-1 text-[11px] font-medium text-harvest-moss hover:bg-harvest-moss/20"
                  >
                    {CATEGORY_LABELS[c]} <X className="h-3 w-3" />
                  </button>
                ))}
                {locations.map((l) => (
                  <button
                    key={l}
                    onClick={() => toggleLocation(l)}
                    data-testid={`active-pill-loc-${l.toLowerCase()}`}
                    className="inline-flex items-center gap-1 rounded-full bg-harvest-gold/15 px-2.5 py-1 text-[11px] font-medium text-harvest-soil hover:bg-harvest-gold/30"
                  >
                    <MapPin className="h-3 w-3" /> {l} <X className="h-3 w-3" />
                  </button>
                ))}
                {(priceMin || priceMax) && (
                  <button
                    onClick={() => {
                      setPriceMin("");
                      setPriceMax("");
                    }}
                    data-testid="active-pill-price"
                    className="inline-flex items-center gap-1 rounded-full bg-harvest-chili/10 px-2.5 py-1 text-[11px] font-medium text-harvest-chili hover:bg-harvest-chili/20"
                  >
                    <Tag className="h-3 w-3" />
                    {priceMin ? rupiah(Number(priceMin)) : "0"} –{" "}
                    {priceMax ? rupiah(Number(priceMax)) : "∞"}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="sort" className="text-xs text-muted-foreground">
                Urutkan:
              </Label>
              <select
                id="sort"
                data-testid="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-harvest-moss/40"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {visible.length === 0 ? (
            <div
              data-testid="empty-state"
              className="rounded-xl border border-dashed border-border bg-card p-12 text-center"
            >
              <p className="font-serif text-2xl">Tidak ada produk yang cocok</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba ubah filter atau kata kunci pencarian.
              </p>
              <Button
                onClick={reset}
                variant="outline"
                className="mt-4"
                data-testid="empty-reset-btn"
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <div
              data-testid="product-grid"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4"
            >
              {visible.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                data-testid="load-more-btn"
                className="border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
              >
                Muat lebih banyak ({filtered.length - visible.length} produk lagi)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

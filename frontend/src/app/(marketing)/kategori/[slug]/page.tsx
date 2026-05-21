"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  ShoppingCart,
  Tag,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PRODUCTS, LOCATIONS, rupiah, type Product } from "@/lib/products";
import { CATEGORIES_META, getCategoryMeta } from "@/lib/categories";

type SortKey = "terbaru" | "termurah" | "termahal" | "terlaris" | "rating";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlaris", label: "Terlaris" },
  { value: "termurah", label: "Termurah" },
  { value: "termahal", label: "Termahal" },
  { value: "rating", label: "Rating Tertinggi" },
];

const PAGE_SIZE = 12;

// ============ FILTER SIDEBAR ============

function CategoryFilters({
  locations,
  toggleLocation,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  ratingMin,
  setRatingMin,
  reset,
  activeCount,
}: {
  locations: string[];
  toggleLocation: (l: string) => void;
  priceMin: string;
  priceMax: string;
  setPriceMin: (v: string) => void;
  setPriceMax: (v: string) => void;
  ratingMin: number;
  setRatingMin: (n: number) => void;
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

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Rentang Harga (Rp)
        </h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            data-testid="filter-price-min"
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
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

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Rating Minimum
        </h4>
        <div className="space-y-2">
          {[0, 4, 4.5, 4.8].map((r) => {
            const active = ratingMin === r;
            return (
              <label
                key={r}
                className="flex cursor-pointer items-center gap-2"
                data-testid={`filter-rating-${r}`}
              >
                <input
                  type="radio"
                  name="rating"
                  checked={active}
                  onChange={() => setRatingMin(r)}
                  className="h-4 w-4 accent-harvest-moss"
                />
                <span className="inline-flex items-center gap-1">
                  {r === 0 ? (
                    <span className={cn(active && "font-semibold text-harvest-moss")}>
                      Semua rating
                    </span>
                  ) : (
                    <>
                      <Star className="h-3.5 w-3.5 fill-harvest-gold text-harvest-gold" />
                      <span className={cn(active && "font-semibold text-harvest-moss")}>
                        {r} ke atas
                      </span>
                    </>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator />

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

      <Separator />

      <div className="rounded-lg bg-gradient-to-br from-harvest-moss/10 to-harvest-gold/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-harvest-moss">
          Butuh produk khusus?
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Chat petani langsung untuk request panen khusus.
        </p>
        <Button asChild size="sm" variant="outline" className="mt-3 w-full border-harvest-moss/40 text-harvest-moss" data-testid="contact-farmer-btn">
          <Link href="/petani">Lihat Petani</Link>
        </Button>
      </div>
    </aside>
  );
}

// ============ PRODUCT CARD ============

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
          <span className={cn("absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold shadow", badgeStyle)}>
            {badgeLabel}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-1 text-sm font-semibold">
          <Link href={`/produk/${p.id}`} className="hover:text-harvest-moss">
            {p.name}
          </Link>
        </h3>
        <p className="line-clamp-1 text-[11px] text-muted-foreground">{p.farmer}</p>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span className="text-base font-bold text-harvest-moss">{rupiah(p.price)}</span>
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
        <Button size="sm" className="mt-3 w-full gap-1.5" data-testid={`add-to-cart-${p.id}`}>
          <ShoppingCart className="h-3.5 w-3.5" />
          Tambah ke Keranjang
        </Button>
      </div>
    </article>
  );
}

// ============ PAGINATION ============

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const add = (n: number | "...") => pages.push(n);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) add(i);
  } else {
    add(1);
    if (page > 3) add("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
    if (page < totalPages - 2) add("...");
    add(totalPages);
  }

  return (
    <nav
      data-testid="pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        data-testid="pagination-prev"
      >
        <ChevronLeft className="h-4 w-4" /> Sebelumnya
      </Button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`gap-${idx}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            data-testid={`pagination-page-${p}`}
            className={cn(
              "min-w-9 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              p === page
                ? "border-harvest-moss bg-harvest-moss text-harvest-cream"
                : "border-border bg-card hover:border-harvest-moss/40"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        data-testid="pagination-next"
      >
        Berikutnya <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

// ============ PAGE ============

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const meta = getCategoryMeta(slug);

  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [ratingMin, setRatingMin] = useState(0);
  const [sort, setSort] = useState<SortKey>("terlaris");
  const [page, setPage] = useState(1);

  const toggleLocation = (l: string) => {
    setLocations((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
    setPage(1);
  };
  const reset = () => {
    setLocations([]);
    setPriceMin("");
    setPriceMax("");
    setRatingMin(0);
    setSearch("");
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!meta) return [];
    const min = priceMin ? Number(priceMin) : -Infinity;
    const max = priceMax ? Number(priceMax) : Infinity;
    const q = search.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (p.category !== meta.category) return false;
      if (locations.length && !locations.includes(p.location)) return false;
      if (p.price < min || p.price > max) return false;
      if (p.rating < ratingMin) return false;
      if (q && !`${p.name} ${p.farmer}`.toLowerCase().includes(q)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sort === "termurah") return a.price - b.price;
      if (sort === "termahal") return b.price - a.price;
      if (sort === "terlaris") return b.sold - a.sold;
      if (sort === "rating") return b.rating - a.rating;
      return a.createdAt - b.createdAt;
    });

    return list;
  }, [meta, locations, priceMin, priceMax, ratingMin, search, sort]);

  if (!meta) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-serif text-4xl">Kategori tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">
          Pilih dari 8 kategori yang tersedia di Green Harvest.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES_META.map((c) => (
            <Button key={c.slug} asChild variant="outline" data-testid={`fallback-cat-${c.slug}`}>
              <Link href={`/kategori/${c.slug}`}>{c.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilterCount =
    locations.length + (priceMin ? 1 : 0) + (priceMax ? 1 : 0) + (ratingMin > 0 ? 1 : 0);

  // Stats from this category
  const allOfCat = PRODUCTS.filter((p) => p.category === meta.category);
  const totalProducts = allOfCat.length;
  const avgRating = allOfCat.length
    ? (allOfCat.reduce((s, p) => s + p.rating, 0) / allOfCat.length).toFixed(1)
    : "—";
  const farmerCount = new Set(allOfCat.map((p) => p.farmer)).size;

  const sidebarProps = {
    locations,
    toggleLocation,
    priceMin,
    priceMax,
    setPriceMin: (v: string) => {
      setPriceMin(v);
      setPage(1);
    },
    setPriceMax: (v: string) => {
      setPriceMax(v);
      setPage(1);
    },
    ratingMin,
    setRatingMin: (n: number) => {
      setRatingMin(n);
      setPage(1);
    },
    reset,
    activeCount: activeFilterCount,
  };

  return (
    <div className="bg-secondary/30">
      {/* BREADCRUMB */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/produk" className="hover:text-foreground">Semua Produk</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{meta.label}</span>
          </nav>
        </div>
      </div>

      {/* BANNER */}
      <section
        data-testid="category-banner"
        className={cn(
          "relative overflow-hidden border-b border-border bg-gradient-to-br text-harvest-cream",
          meta.gradient
        )}
      >
        <div className="absolute inset-0 grain opacity-30" />
        <div className="absolute -right-10 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="aspect-square w-72 overflow-hidden rounded-3xl border-4 border-harvest-cream/20 shadow-2xl">
            <img
              src={meta.bannerImg}
              alt={meta.label}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="container relative py-12 md:py-16">
          <div className="max-w-2xl">
            <span
              data-testid="category-badge"
              className="inline-flex items-center gap-1.5 rounded-full bg-harvest-cream/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-harvest-amber" />
              Kategori · {meta.badge}
            </span>
            <h1
              data-testid="category-title"
              className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl"
            >
              {meta.label}
            </h1>
            <p
              data-testid="category-tagline"
              className="mt-3 text-xl italic text-harvest-amber md:text-2xl"
            >
              {meta.tagline}
            </p>
            <p
              data-testid="category-description"
              className="mt-4 max-w-xl text-sm leading-relaxed text-harvest-cream/85"
            >
              {meta.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <div className="rounded-lg bg-harvest-cream/10 px-4 py-2 backdrop-blur" data-testid="stat-products">
                <p className="text-[10px] uppercase tracking-wide text-harvest-cream/70">Produk</p>
                <p className="font-bold">{totalProducts}</p>
              </div>
              <div className="rounded-lg bg-harvest-cream/10 px-4 py-2 backdrop-blur" data-testid="stat-rating">
                <p className="text-[10px] uppercase tracking-wide text-harvest-cream/70">Rata-rata Rating</p>
                <p className="inline-flex items-center gap-1 font-bold">
                  <Star className="h-3.5 w-3.5 fill-harvest-amber text-harvest-amber" />
                  {avgRating}
                </p>
              </div>
              <div className="rounded-lg bg-harvest-cream/10 px-4 py-2 backdrop-blur" data-testid="stat-farmers">
                <p className="text-[10px] uppercase tracking-wide text-harvest-cream/70">Petani Aktif</p>
                <p className="font-bold">{farmerCount}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY CHIPS */}
      <div className="border-b border-border bg-card">
        <div className="container overflow-x-auto py-3">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Kategori lain:
            </span>
            {CATEGORIES_META.filter((c) => c.slug !== meta.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                data-testid={`other-cat-${c.slug}`}
                className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-harvest-moss/40 hover:text-harvest-moss"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-32 rounded-xl border border-border bg-card p-5">
            <CategoryFilters {...sidebarProps} />
          </div>
        </div>

        {/* Main */}
        <div>
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden" data-testid="mobile-filter-trigger">
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
                <h2 className="mb-4 font-serif text-2xl">Filter {meta.label}</h2>
                <CategoryFilters {...sidebarProps} />
              </SheetContent>
            </Sheet>

            {/* Inline search */}
            <form
              role="search"
              className="relative flex-1 min-w-[180px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Cari di ${meta.label.toLowerCase()}…`}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                data-testid="category-search-input"
                className="h-9 rounded-full border-harvest-moss/30 bg-background pl-10"
              />
            </form>

            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="sort" className="hidden text-xs text-muted-foreground sm:inline">
                Urutkan:
              </Label>
              <select
                id="sort"
                data-testid="sort-select"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  setPage(1);
                }}
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

          {/* Result line + active pills */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
            <p data-testid="result-count" className="text-muted-foreground">
              Menampilkan{" "}
              <span className="font-semibold text-foreground">
                {visible.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                {(page - 1) * PAGE_SIZE + visible.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span> produk
              {meta.label}
            </p>

            <div className="ml-auto hidden flex-wrap gap-1.5 lg:flex">
              {locations.map((l) => (
                <button
                  key={l}
                  onClick={() => toggleLocation(l)}
                  className="inline-flex items-center gap-1 rounded-full bg-harvest-gold/15 px-2.5 py-1 text-[11px] font-medium text-harvest-soil hover:bg-harvest-gold/30"
                  data-testid={`pill-loc-${l.toLowerCase()}`}
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
                  className="inline-flex items-center gap-1 rounded-full bg-harvest-chili/10 px-2.5 py-1 text-[11px] font-medium text-harvest-chili hover:bg-harvest-chili/20"
                  data-testid="pill-price"
                >
                  <Tag className="h-3 w-3" />
                  {priceMin ? rupiah(Number(priceMin)) : "0"} –{" "}
                  {priceMax ? rupiah(Number(priceMax)) : "∞"}
                  <X className="h-3 w-3" />
                </button>
              )}
              {ratingMin > 0 && (
                <button
                  onClick={() => setRatingMin(0)}
                  className="inline-flex items-center gap-1 rounded-full bg-harvest-moss/10 px-2.5 py-1 text-[11px] font-medium text-harvest-moss hover:bg-harvest-moss/20"
                  data-testid="pill-rating"
                >
                  <Star className="h-3 w-3 fill-harvest-gold text-harvest-gold" />
                  ≥ {ratingMin}
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {visible.length === 0 ? (
            <div
              data-testid="empty-state"
              className="rounded-xl border border-dashed border-border bg-card p-12 text-center"
            >
              <p className="font-serif text-2xl">Belum ada produk yang cocok</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba longgarkan filter atau cek kategori lain.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button onClick={reset} variant="outline" data-testid="empty-reset-btn">
                  Reset Filter
                </Button>
                <Button asChild data-testid="empty-browse-btn">
                  <Link href="/produk">
                    Jelajahi semua produk <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                data-testid="product-grid"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4"
              >
                {visible.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

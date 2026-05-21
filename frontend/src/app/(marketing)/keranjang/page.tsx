"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Tag,
  Truck,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Store,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { rupiah } from "@/lib/products";
import { useCart, type CartLine } from "@/lib/cart";

const SHIPPING_FEE = 15000;
const FREE_SHIP_THRESHOLD = 100000;

// =========== EMPTY STATE ===========

function EmptyCart() {
  return (
    <div
      data-testid="empty-cart"
      className="container py-20 text-center"
    >
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-harvest-moss/10">
        <ShoppingBag className="h-12 w-12 text-harvest-moss" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-serif text-3xl tracking-tight md:text-4xl">
        Keranjang kamu masih kosong
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Yuk mulai isi keranjang dengan hasil tani segar pilihan dari petani Indonesia.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" data-testid="empty-shop-btn">
          <Link href="/produk">
            Mulai Belanja
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" data-testid="empty-categories-btn">
          <Link href="/kategori/sayuran">Lihat Kategori</Link>
        </Button>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/kategori/sayuran", label: "Sayuran", emoji: "🥬" },
          { href: "/kategori/buah-buahan", label: "Buah", emoji: "🍎" },
          { href: "/kategori/beras", label: "Beras", emoji: "🌾" },
          { href: "/kategori/rempah", label: "Rempah", emoji: "🌶️" },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-harvest-moss/40 hover:shadow"
            data-testid={`empty-quick-${c.label.toLowerCase()}`}
          >
            <p className="text-2xl">{c.emoji}</p>
            <p className="mt-1 text-sm font-medium">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// =========== LINE ITEM ===========

function CartItemRow({
  line,
  selected,
  onToggle,
  onInc,
  onDec,
  onSetQty,
  onRemove,
}: {
  line: CartLine;
  selected: boolean;
  onToggle: () => void;
  onInc: () => void;
  onDec: () => void;
  onSetQty: (n: number) => void;
  onRemove: () => void;
}) {
  const p = line.product;

  return (
    <div
      data-testid={`cart-item-${p.id}`}
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-3 transition-colors sm:flex-row sm:items-center",
        selected ? "border-harvest-moss/40" : "border-border"
      )}
    >
      {/* Selector + image + info */}
      <div className="flex flex-1 gap-3">
        <label className="flex shrink-0 items-center" data-testid={`cart-item-checkbox-${p.id}`}>
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="h-4 w-4 accent-harvest-moss"
            aria-label={`Pilih ${p.name}`}
          />
        </label>

        <Link
          href={`/produk/${p.id}`}
          className="block h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-secondary sm:h-24 sm:w-24"
        >
          <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
        </Link>

        <div className="flex flex-1 flex-col">
          <Link
            href={`/produk/${p.id}`}
            className="line-clamp-2 text-sm font-semibold leading-tight hover:text-harvest-moss"
            data-testid={`cart-item-name-${p.id}`}
          >
            {p.name}
          </Link>
          <p
            className="mt-0.5 text-xs text-muted-foreground"
            data-testid={`cart-item-farmer-${p.id}`}
          >
            {p.farmer}
            <span className="mx-1">·</span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" /> {p.location}
            </span>
          </p>

          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className="text-sm font-bold text-harvest-moss sm:text-base"
              data-testid={`cart-item-price-${p.id}`}
            >
              {rupiah(p.price)}
            </span>
            <span className="text-[11px] text-muted-foreground">{p.unit}</span>
          </div>
        </div>
      </div>

      {/* Qty + subtotal + remove */}
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
        <div
          className="inline-flex items-center rounded-md border border-input"
          data-testid={`cart-item-qty-${p.id}`}
        >
          <button
            onClick={onDec}
            disabled={line.qty <= 1}
            aria-label="Kurangi"
            data-testid={`cart-qty-dec-${p.id}`}
            className="grid h-8 w-8 place-items-center text-muted-foreground hover:bg-secondary disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            value={line.qty}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!isNaN(n) && n >= 0) onSetQty(n);
            }}
            data-testid={`cart-qty-input-${p.id}`}
            className="h-8 w-12 border-x border-input bg-transparent text-center text-sm font-semibold focus:outline-none"
          />
          <button
            onClick={onInc}
            aria-label="Tambah"
            data-testid={`cart-qty-inc-${p.id}`}
            className="grid h-8 w-8 place-items-center text-muted-foreground hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span
            className="font-serif text-base font-bold text-harvest-moss sm:text-lg"
            data-testid={`cart-item-subtotal-${p.id}`}
          >
            {rupiah(line.subtotal)}
          </span>
          <button
            onClick={onRemove}
            data-testid={`cart-item-remove-${p.id}`}
            aria-label={`Hapus ${p.name} dari keranjang`}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-harvest-chili/10 hover:text-harvest-chili"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// =========== PAGE ===========

export default function KeranjangPage() {
  const cart = useCart();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; pct: number } | null>(null);

  // When lines hydrate, default-select everything
  useMemo(() => {
    if (cart.hydrated && selected.size === 0 && cart.lines.length > 0) {
      setSelected(new Set(cart.lines.map((l) => l.product.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.hydrated, cart.lines.length]);

  // Group by farmer
  const grouped = useMemo(() => {
    const map = new Map<string, { farmer: string; location: string; lines: CartLine[] }>();
    for (const line of cart.lines) {
      const key = line.product.farmer;
      if (!map.has(key)) {
        map.set(key, {
          farmer: key,
          location: line.product.location,
          lines: [],
        });
      }
      map.get(key)!.lines.push(line);
    }
    return Array.from(map.values());
  }, [cart.lines]);

  if (!cart.hydrated) {
    return (
      <div className="container py-24 text-center text-sm text-muted-foreground">
        Memuat keranjang…
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return <EmptyCart />;
  }

  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectAll = () => {
    if (selected.size === cart.lines.length) setSelected(new Set());
    else setSelected(new Set(cart.lines.map((l) => l.product.id)));
  };

  const selectedLines = cart.lines.filter((l) => selected.has(l.product.id));
  const subtotal = selectedLines.reduce((s, l) => s + l.subtotal, 0);
  const shippingFree = subtotal >= FREE_SHIP_THRESHOLD;
  const shipping = subtotal > 0 && !shippingFree ? SHIPPING_FEE : 0;
  const discount = promoApplied
    ? Math.round((subtotal * promoApplied.pct) / 100)
    : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const allSelected = selected.size === cart.lines.length;
  const progressPct = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    const KNOWN: Record<string, number> = { PANEN10: 10, TANI20: 20, HARVEST5: 5 };
    if (KNOWN[code]) {
      setPromoApplied({ code, pct: KNOWN[code] });
    } else {
      setPromoApplied(null);
      alert("Kode promo tidak valid. Coba: PANEN10, TANI20, atau HARVEST5");
    }
  };

  return (
    <div className="bg-secondary/30">
      {/* BREADCRUMB */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Keranjang</span>
          </nav>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1
              data-testid="cart-title"
              className="font-serif text-3xl tracking-tight md:text-4xl"
            >
              Keranjang Belanja
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span data-testid="cart-item-count" className="font-semibold text-foreground">
                {cart.totalItems}
              </span>{" "}
              produk dari{" "}
              <span className="font-semibold text-foreground">{grouped.length}</span> petani
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Kosongkan seluruh keranjang?")) cart.clear();
            }}
            className="text-muted-foreground hover:text-harvest-chili"
            data-testid="clear-cart-btn"
          >
            <Trash2 className="h-4 w-4" />
            Kosongkan
          </Button>
        </div>

        {/* Free shipping progress */}
        <div
          data-testid="free-ship-banner"
          className="mb-6 rounded-xl border border-harvest-gold/30 bg-gradient-to-r from-harvest-gold/10 to-harvest-amber/10 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="inline-flex items-center gap-2 font-medium">
              <Truck className="h-4 w-4 text-harvest-gold" />
              {shippingFree ? (
                <span className="text-harvest-moss">
                  🎉 Selamat! Pesananmu sudah gratis ongkir.
                </span>
              ) : (
                <span>
                  Belanja{" "}
                  <span className="font-bold text-harvest-moss">
                    {rupiah(FREE_SHIP_THRESHOLD - subtotal)}
                  </span>{" "}
                  lagi untuk gratis ongkir
                </span>
              )}
            </p>
            <span className="text-xs font-semibold text-muted-foreground">
              {progressPct}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-harvest-cream">
            <div
              className="h-full bg-gradient-to-r from-harvest-leaf to-harvest-gold transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* LEFT: items grouped by farmer */}
          <div className="space-y-4">
            {/* Select all */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
              <label className="inline-flex cursor-pointer items-center gap-2" data-testid="select-all-toggle">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 accent-harvest-moss"
                />
                <span className="font-medium">Pilih semua ({cart.lines.length} produk)</span>
              </label>
              <span className="text-xs text-muted-foreground" data-testid="selected-count">
                {selected.size} dipilih
              </span>
            </div>

            {/* Groups */}
            {grouped.map((g) => {
              const groupSelected = g.lines.every((l) => selected.has(l.product.id));
              const someSelected = g.lines.some((l) => selected.has(l.product.id));
              return (
                <section
                  key={g.farmer}
                  data-testid={`farmer-group-${g.farmer.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  {/* Farmer header */}
                  <div className="mb-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={groupSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = !groupSelected && someSelected;
                      }}
                      onChange={() => {
                        const next = new Set(selected);
                        if (groupSelected) {
                          g.lines.forEach((l) => next.delete(l.product.id));
                        } else {
                          g.lines.forEach((l) => next.add(l.product.id));
                        }
                        setSelected(next);
                      }}
                      className="h-4 w-4 accent-harvest-moss"
                    />
                    <Store className="h-4 w-4 text-harvest-moss" />
                    <Link
                      href="/petani"
                      className="text-sm font-semibold hover:text-harvest-moss"
                      data-testid={`farmer-link-${g.farmer.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {g.farmer}
                    </Link>
                    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {g.location}
                    </span>
                    <span className="ml-auto rounded-full bg-harvest-moss/10 px-2 py-0.5 text-[10px] font-bold text-harvest-moss">
                      Verified
                    </span>
                  </div>

                  <div className="space-y-3">
                    {g.lines.map((line) => (
                      <CartItemRow
                        key={line.product.id}
                        line={line}
                        selected={selected.has(line.product.id)}
                        onToggle={() => toggleSelect(line.product.id)}
                        onInc={() => cart.increment(line.product.id)}
                        onDec={() => cart.decrement(line.product.id)}
                        onSetQty={(n) => cart.setQty(line.product.id, n)}
                        onRemove={() => {
                          cart.remove(line.product.id);
                          setSelected((s) => {
                            const next = new Set(s);
                            next.delete(line.product.id);
                            return next;
                          });
                        }}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="rounded-xl border border-dashed border-border bg-card p-4 text-center text-sm text-muted-foreground">
              <p>
                Belum cukup?{" "}
                <Link href="/produk" className="font-semibold text-harvest-moss hover:underline" data-testid="continue-shop-link">
                  Lanjut belanja →
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <aside className="lg:sticky lg:top-32 lg:self-start" data-testid="cart-summary">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-serif text-xl">Ringkasan Belanja</h2>
              <Separator className="my-4" />

              {/* Promo code */}
              <div className="space-y-2">
                <label htmlFor="promo" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Kode Promo
                </label>
                {promoApplied ? (
                  <div
                    data-testid="promo-applied"
                    className="flex items-center justify-between rounded-md bg-harvest-moss/10 px-3 py-2 text-sm"
                  >
                    <span className="inline-flex items-center gap-2 font-semibold text-harvest-moss">
                      <Tag className="h-4 w-4" />
                      {promoApplied.code} (-{promoApplied.pct}%)
                    </span>
                    <button
                      onClick={() => {
                        setPromoApplied(null);
                        setPromo("");
                      }}
                      data-testid="promo-remove-btn"
                      className="text-xs text-harvest-chili hover:underline"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      data-testid="promo-input"
                      placeholder="PANEN10, TANI20…"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value.toUpperCase())}
                      className="h-10"
                    />
                    <Button
                      onClick={applyPromo}
                      data-testid="promo-apply-btn"
                      size="default"
                      variant="outline"
                      className="border-harvest-moss/40 text-harvest-moss"
                    >
                      Pakai
                    </Button>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Line items */}
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Subtotal ({selectedLines.length} produk)
                  </dt>
                  <dd className="font-semibold" data-testid="summary-subtotal">
                    {rupiah(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="inline-flex items-center gap-1 text-muted-foreground">
                    Ongkos kirim
                    {shippingFree && (
                      <span className="rounded bg-harvest-moss/10 px-1.5 text-[10px] font-bold text-harvest-moss">
                        GRATIS
                      </span>
                    )}
                  </dt>
                  <dd
                    className={cn("font-semibold", shippingFree && "text-harvest-moss line-through")}
                    data-testid="summary-shipping"
                  >
                    {shippingFree ? rupiah(SHIPPING_FEE) : rupiah(shipping)}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Diskon promo</dt>
                    <dd className="font-semibold text-harvest-chili" data-testid="summary-discount">
                      −{rupiah(discount)}
                    </dd>
                  </div>
                )}
              </dl>

              <Separator className="my-4" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Total</span>
                <span
                  className="font-serif text-2xl font-bold text-harvest-moss"
                  data-testid="summary-total"
                >
                  {rupiah(total)}
                </span>
              </div>

              <Button
                size="lg"
                className="mt-5 w-full bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
                disabled={selectedLines.length === 0}
                data-testid="checkout-btn"
              >
                Lanjut ke Pembayaran
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Trust */}
              <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-harvest-moss" />
                  Garansi mutu produk — uang kembali jika tidak segar
                </li>
                <li className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4 text-harvest-moss" />
                  Pengiriman terkurasi dengan kemasan suhu terjaga
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE STICKY CHECKOUT */}
      <div
        data-testid="mobile-sticky-checkout"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 shadow-lg lg:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="font-serif text-lg font-bold text-harvest-moss" data-testid="mobile-total">
              {rupiah(total)}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
            disabled={selectedLines.length === 0}
            data-testid="mobile-checkout-btn"
          >
            Bayar ({selectedLines.length})
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}

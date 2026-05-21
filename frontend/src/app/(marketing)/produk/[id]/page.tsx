"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Star,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  BadgeCheck,
  Truck,
  ShieldCheck,
  PackageCheck,
  Heart,
  Share2,
  MessageCircle,
  Leaf,
  Clock,
  CreditCard,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PRODUCTS, CATEGORY_LABELS, rupiah, type Product } from "@/lib/products";

// ============== HELPERS ==============

function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

function getRelated(current: Product, count = 6): Product[] {
  return PRODUCTS.filter((p) => p.id !== current.id && p.category === current.category)
    .slice(0, count)
    .concat(
      PRODUCTS.filter((p) => p.id !== current.id && p.category !== current.category)
    )
    .slice(0, count);
}

function getGallery(p: Product): string[] {
  const farmFallbacks = [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=70",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=70",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=70",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=70",
  ];
  return [p.img, ...farmFallbacks.slice(0, 3)];
}

const DESCRIPTIONS: Record<Product["category"], string> = {
  sayuran:
    "Sayur segar yang dipetik langsung dari kebun di pagi hari. Ditanam dengan metode tradisional tanpa pestisida berlebih, dipilih dengan cermat untuk memastikan kualitas terbaik sampai ke dapur Anda. Cocok untuk masakan sehari-hari maupun hidangan istimewa keluarga.",
  buah:
    "Buah pilihan dengan kematangan optimal, dipetik tepat waktu dari kebun lokal. Manis alami tanpa pengawet, kaya vitamin dan serat. Setiap buah disortir manual untuk memastikan kualitas premium yang sampai di tangan Anda.",
  beras:
    "Beras berkualitas hasil panen petani lokal dengan proses penggilingan modern. Pulen, wangi, dan bebas dari kutu maupun pemutih. Disimpan di gudang berventilasi baik untuk menjaga kesegaran dan kandungan gizi.",
  rempah:
    "Rempah pilihan kualitas ekspor yang dikeringkan secara alami. Aroma khas yang kuat membuat masakan rumahan jadi lebih nikmat. Diproses higienis dan dikemas rapi untuk menjaga kualitas selama penyimpanan.",
  bibit:
    "Bibit unggul dengan tingkat tumbuh tinggi, hasil seleksi berlapis. Cocok untuk pemula maupun petani berpengalaman. Tahan terhadap hama umum dan memberikan hasil panen yang melimpah dalam waktu singkat.",
  pupuk:
    "Pupuk berkualitas tinggi yang teruji meningkatkan produktivitas tanaman. Aman digunakan untuk berbagai jenis tanaman, mengandung unsur hara yang seimbang. Ramah lingkungan dan tidak merusak struktur tanah.",
  organik:
    "Produk organik bersertifikat yang ditanam tanpa pestisida sintetis maupun pupuk kimia. Sehat untuk keluarga, baik untuk bumi. Dipanen dengan tangan oleh petani lokal yang berpengalaman.",
  umkm:
    "Produk olahan UMKM lokal Indonesia dengan resep turun-temurun. Diproduksi rumahan dengan bahan baku berkualitas. Mendukung ekonomi keluarga petani dan UMKM Indonesia.",
};

interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
  variant?: string;
}

const REVIEWS_POOL: Review[] = [
  { name: "Andi Saputra", rating: 5, date: "3 hari lalu", text: "Produknya benar-benar segar! Sampai dengan kondisi prima, packing rapi. Akan order lagi.", variant: "Beli 1 kg" },
  { name: "Sari Wulandari", rating: 5, date: "1 minggu lalu", text: "Kualitas premium dengan harga terjangkau. Penjualnya ramah dan responsif. Recommended!", variant: "Beli 500 gr" },
  { name: "Budi Hartono", rating: 4, date: "2 minggu lalu", text: "Sesuai deskripsi, rasa sangat enak. Pengiriman cepat, dalam 1 hari sudah sampai.", variant: "Beli 2 kg" },
  { name: "Lina Marlina", rating: 5, date: "3 minggu lalu", text: "Pertama kali pesan, langsung jatuh cinta. Bedanya kelihatan dibanding beli di pasar biasa.", variant: "Beli 1 kg" },
  { name: "Rahmat Hidayat", rating: 5, date: "1 bulan lalu", text: "Mantap! Sudah langganan dari kebun pak Wahyu, kualitasnya konsisten dari panen ke panen.", variant: "Beli 5 kg" },
];

function StarRow({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.round(rating)
              ? "fill-harvest-gold text-harvest-gold"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </span>
  );
}

// ============== PAGE ==============

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const product = getProduct(id);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"deskripsi" | "pengiriman" | "ulasan">("deskripsi");

  const related = useMemo(() => (product ? getRelated(product) : []), [product]);

  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-serif text-4xl">Produk tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">
          Produk yang Anda cari mungkin sudah habis atau dihapus.
        </p>
        <Button asChild className="mt-6" data-testid="back-to-produk">
          <Link href="/produk">← Kembali ke daftar produk</Link>
        </Button>
      </div>
    );
  }

  const stock = 60 + (parseInt(product.id.replace(/\D/g, ""), 10) % 40); // 60-99
  const gallery = getGallery(product);
  const reviews = REVIEWS_POOL.slice(0, 4 + ((stock + product.sold) % 2)); // 4-5 reviews
  const reviewsCount = Math.max(48, Math.floor(product.sold / 6));
  const discount = product.badge === "promo" ? 25 : 0;
  const oldPrice = discount ? Math.round(product.price / (1 - discount / 100)) : 0;

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
            <Link href={`/produk?kategori=${product.category}`} className="hover:text-foreground">
              {CATEGORY_LABELS[product.category]}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-6">
        {/* MAIN CARD */}
        <section className="grid gap-6 rounded-2xl border border-border bg-card p-4 md:p-6 lg:grid-cols-12">
          {/* GALLERY */}
          <div className="lg:col-span-5" data-testid="product-gallery">
            <div className="overflow-hidden rounded-xl border border-border bg-secondary">
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className="aspect-square w-full object-cover"
                data-testid="gallery-main-img"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  data-testid={`gallery-thumb-${i}`}
                  className={cn(
                    "overflow-hidden rounded-md border-2 transition-all",
                    activeImg === i
                      ? "border-harvest-moss ring-2 ring-harvest-moss/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" data-testid="product-share-btn">
                <Share2 className="h-4 w-4" /> Bagikan
              </Button>
              <Button variant="outline" size="sm" className="flex-1" data-testid="product-wishlist-btn">
                <Heart className="h-4 w-4" /> Wishlist
              </Button>
            </div>
          </div>

          {/* INFO */}
          <div className="lg:col-span-7">
            {product.badge && (
              <span
                className={cn(
                  "mb-3 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold",
                  product.badge === "promo"
                    ? "bg-harvest-chili text-white"
                    : product.badge === "terlaris"
                      ? "bg-harvest-gold text-harvest-soil"
                      : "bg-harvest-leaf text-white"
                )}
                data-testid="product-badge"
              >
                {product.badge === "promo" ? "PROMO SPESIAL" : product.badge === "terlaris" ? "TERLARIS" : "PRODUK BARU"}
              </span>
            )}

            <h1
              data-testid="product-name"
              className="font-serif text-3xl leading-tight tracking-tight md:text-4xl"
            >
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1" data-testid="product-rating">
                <Star className="h-4 w-4 fill-harvest-gold text-harvest-gold" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground">({reviewsCount} ulasan)</span>
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground" data-testid="product-sold">
                <span className="font-semibold text-foreground">
                  {product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}rb` : product.sold}
                </span>{" "}
                terjual
              </span>
              <Separator orientation="vertical" className="h-4" />
              <a href="#ulasan" className="text-harvest-moss hover:underline" data-testid="product-see-reviews-link">
                Lihat ulasan
              </a>
            </div>

            {/* PRICE BLOCK */}
            <div
              data-testid="product-price-block"
              className="mt-5 rounded-xl bg-gradient-to-r from-harvest-moss/5 to-harvest-gold/10 p-5"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-serif text-4xl font-bold text-harvest-moss" data-testid="product-price">
                  {rupiah(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">{product.unit}</span>
                {discount > 0 && (
                  <>
                    <span className="rounded-md bg-harvest-chili/10 px-2 py-0.5 text-xs font-bold text-harvest-chili" data-testid="product-discount">
                      -{discount}%
                    </span>
                    <span className="text-sm text-muted-foreground line-through" data-testid="product-old-price">
                      {rupiah(oldPrice)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Termasuk PPN · Belum termasuk ongkir
              </p>
            </div>

            {/* STOCK & QUANTITY */}
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="font-medium">Stok:</span>
                <span data-testid="product-stock" className="inline-flex items-center gap-1.5 font-semibold text-harvest-moss">
                  <PackageCheck className="h-4 w-4" />
                  Tersedia {stock} stok
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium">Jumlah:</span>
                <div className="inline-flex items-center rounded-md border border-input" data-testid="quantity-selector">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi"
                    data-testid="qty-decrement"
                    className="grid h-10 w-10 place-items-center text-muted-foreground hover:bg-secondary disabled:opacity-50"
                    disabled={qty <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (!isNaN(n)) setQty(Math.max(1, Math.min(stock, n)));
                    }}
                    data-testid="qty-input"
                    className="h-10 w-14 border-x border-input bg-transparent text-center text-sm font-semibold focus:outline-none"
                  />
                  <button
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    aria-label="Tambah"
                    data-testid="qty-increment"
                    className="grid h-10 w-10 place-items-center text-muted-foreground hover:bg-secondary disabled:opacity-50"
                    disabled={qty >= stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">
                  Subtotal:{" "}
                  <span className="font-bold text-harvest-moss" data-testid="product-subtotal">
                    {rupiah(product.price * qty)}
                  </span>
                </span>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                size="lg"
                className="border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="h-4 w-4" />
                Tambah ke Keranjang
              </Button>
              <Button
                size="lg"
                className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
                data-testid="buy-now-btn"
              >
                <Zap className="h-4 w-4" />
                Beli Sekarang
              </Button>
            </div>

            {/* TRUST BAR */}
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-dashed border-harvest-moss/30 bg-harvest-moss/5 p-3 sm:grid-cols-4">
              {[
                { icon: Leaf, label: "100% Segar" },
                { icon: Truck, label: "Pengiriman Cepat" },
                { icon: ShieldCheck, label: "Garansi Mutu" },
                { icon: RefreshCw, label: "Bisa Tukar" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-xs">
                  <t.icon className="h-4 w-4 text-harvest-moss" />
                  <span className="font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FARMER + SHIPPING */}
        <section className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Farmer card */}
          <article
            data-testid="farmer-card"
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative h-20 bg-gradient-to-br from-harvest-moss via-harvest-leaf to-harvest-lime">
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-harvest-cream px-2 py-0.5 text-[10px] font-bold text-harvest-moss shadow">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            </div>
            <div className="px-5 pb-5">
              <div className="-mt-8 mb-3 h-16 w-16 overflow-hidden rounded-full border-4 border-card bg-secondary">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70"
                  alt={product.farmer}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 data-testid="farmer-name" className="font-serif text-lg">
                {product.farmer}
              </h3>
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground" data-testid="farmer-location">
                <MapPin className="h-3 w-3" /> {product.location}, Indonesia
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-secondary/50 p-2">
                  <p className="font-bold text-harvest-moss">4.9</p>
                  <p className="text-[10px] text-muted-foreground">Rating Toko</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2">
                  <p className="font-bold text-harvest-moss">{Math.floor(product.sold / 3)}</p>
                  <p className="text-[10px] text-muted-foreground">Produk</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2">
                  <p className="font-bold text-harvest-moss">2 thn</p>
                  <p className="text-[10px] text-muted-foreground">Bergabung</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1" data-testid="visit-shop-btn">
                  <Link href="/petani">Kunjungi Toko</Link>
                </Button>
                <Button variant="outline" size="sm" data-testid="chat-farmer-btn" aria-label="Chat petani">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>

          {/* Shipping info */}
          <article
            data-testid="shipping-card"
            className="rounded-2xl border border-border bg-card p-5 md:col-span-2"
          >
            <h3 className="font-serif text-lg">Informasi Pengiriman</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Pengiriman dari{" "}
              <span className="font-semibold text-foreground">{product.location}</span>
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-harvest-moss" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">Pengiriman Reguler</p>
                    <p className="text-sm font-bold text-harvest-moss">Rp 15.000</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Estimasi tiba 2-3 hari · Suhu terjaga</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-harvest-gold" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold inline-flex items-center gap-1.5">
                      Same Day Delivery
                      <span className="rounded bg-harvest-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-harvest-soil">
                        Khusus Jabodetabek
                      </span>
                    </p>
                    <p className="text-sm font-bold text-harvest-moss">Rp 25.000</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Order sebelum jam 10:00 WIB, sampai hari ini</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-harvest-moss" />
                <div className="flex-1">
                  <p className="font-semibold">Metode Pembayaran</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["BCA", "Mandiri", "BNI", "OVO", "GoPay", "Dana", "QRIS", "COD"].map((p) => (
                      <span key={p} className="rounded-md bg-card px-2 py-1 text-[10px] font-bold text-foreground ring-1 ring-border">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* TABS */}
        <section className="mt-6 rounded-2xl border border-border bg-card" id="ulasan">
          <div className="flex flex-wrap items-center gap-1 border-b border-border px-4 pt-3 md:px-6">
            {[
              { key: "deskripsi", label: "Deskripsi Produk" },
              { key: "pengiriman", label: "Catatan Pengiriman" },
              { key: "ulasan", label: `Ulasan (${reviewsCount})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as typeof tab)}
                data-testid={`tab-${t.key}`}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
                  tab === t.key
                    ? "text-harvest-moss"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-harvest-moss" />
                )}
              </button>
            ))}
          </div>

          <div className="p-5 md:p-6">
            {tab === "deskripsi" && (
              <div data-testid="tab-content-deskripsi" className="prose-sm max-w-3xl space-y-4 text-sm leading-relaxed">
                <p className="text-base">{DESCRIPTIONS[product.category]}</p>
                <h4 className="font-serif text-lg">Spesifikasi Produk</h4>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  <li className="flex justify-between gap-3 border-b border-dashed border-border py-2">
                    <span className="text-muted-foreground">Kategori</span>
                    <span className="font-semibold">{CATEGORY_LABELS[product.category]}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-dashed border-border py-2">
                    <span className="text-muted-foreground">Asal</span>
                    <span className="font-semibold">{product.location}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-dashed border-border py-2">
                    <span className="text-muted-foreground">Petani</span>
                    <span className="font-semibold">{product.farmer}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-dashed border-border py-2">
                    <span className="text-muted-foreground">Berat / Satuan</span>
                    <span className="font-semibold">{product.unit.replace("/", "").trim()}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-dashed border-border py-2">
                    <span className="text-muted-foreground">Kondisi</span>
                    <span className="font-semibold">Segar / Baru</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-dashed border-border py-2">
                    <span className="text-muted-foreground">Stok</span>
                    <span className="font-semibold">{stock}</span>
                  </li>
                </ul>
                <h4 className="font-serif text-lg">Tips Penyimpanan</h4>
                <p>
                  Simpan di tempat sejuk dan kering. Jauhkan dari sinar matahari langsung. Untuk hasil terbaik, konsumsi atau gunakan dalam 5-7 hari setelah penerimaan.
                </p>
              </div>
            )}

            {tab === "pengiriman" && (
              <div data-testid="tab-content-pengiriman" className="max-w-3xl space-y-3 text-sm leading-relaxed">
                <p>
                  Produk dikirim langsung dari kebun{" "}
                  <span className="font-semibold">{product.farmer}</span> di {product.location}. Kami menggunakan ekspedisi tepercaya dengan kemasan khusus untuk menjaga kesegaran.
                </p>
                <ul className="ml-5 list-disc space-y-1.5">
                  <li>Pesanan diproses 1x24 jam pada hari kerja</li>
                  <li>Kemasan tahan getar & menggunakan ice gel untuk produk perishable</li>
                  <li>Tracking pengiriman dapat diakses dari halaman pesanan</li>
                  <li>Klaim kerusakan dapat dilakukan dalam 24 jam setelah barang diterima</li>
                  <li>Pengiriman ke wilayah remote dapat memerlukan biaya tambahan</li>
                </ul>
              </div>
            )}

            {tab === "ulasan" && (
              <div data-testid="tab-content-ulasan" className="space-y-4">
                {/* Rating summary */}
                <div className="flex flex-wrap items-center gap-6 rounded-xl bg-secondary/40 p-5">
                  <div className="text-center">
                    <p className="font-serif text-5xl font-bold text-harvest-moss">{product.rating}</p>
                    <StarRow rating={product.rating} className="mt-1 justify-center" />
                    <p className="mt-1 text-xs text-muted-foreground">{reviewsCount} ulasan</p>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-[180px]">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 78 : s === 4 ? 16 : s === 3 ? 4 : s === 2 ? 1 : 1;
                      return (
                        <div key={s} className="flex items-center gap-2 text-xs">
                          <span className="w-3 font-medium">{s}</span>
                          <Star className="h-3 w-3 fill-harvest-gold text-harvest-gold" />
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full bg-harvest-gold"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-muted-foreground">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                <ul className="divide-y divide-border">
                  {reviews.map((r, idx) => (
                    <li
                      key={idx}
                      data-testid={`review-${idx}`}
                      className="flex gap-3 py-4"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-harvest-moss/10 font-semibold text-harvest-moss">
                        {r.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{r.name}</p>
                          <StarRow rating={r.rating} />
                          <span className="text-xs text-muted-foreground">· {r.date}</span>
                        </div>
                        {r.variant && (
                          <p className="text-xs text-muted-foreground">Variant: {r.variant}</p>
                        )}
                        <p className="mt-1.5 text-sm leading-relaxed">{r.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="w-full border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
                  data-testid="see-all-reviews-btn"
                >
                  Lihat semua {reviewsCount} ulasan
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-8" data-testid="related-section">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-gold">
                  Untukmu
                </p>
                <h2 className="mt-1 font-serif text-2xl tracking-tight md:text-3xl">
                  Produk Serupa
                </h2>
              </div>
              <Link
                href="/produk"
                className="text-sm font-medium text-harvest-moss hover:underline"
                data-testid="see-all-related"
              >
                Lihat semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 md:gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/produk/${rp.id}`}
                  data-testid={`related-${rp.id}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={rp.img}
                      alt={rp.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold">{rp.name}</h3>
                    <p className="line-clamp-1 text-[11px] text-muted-foreground">{rp.farmer}</p>
                    <p className="mt-1 text-base font-bold text-harvest-moss">{rupiah(rp.price)}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-harvest-gold text-harvest-gold" />
                        <span className="font-semibold text-foreground">{rp.rating}</span>
                      </span>
                      <span>·</span>
                      <span>{rp.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div
        data-testid="mobile-sticky-bar"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-border bg-card p-3 shadow-lg md:hidden"
      >
        <Button
          variant="outline"
          className="flex-1 border-harvest-moss/40 text-harvest-moss"
          data-testid="mobile-add-to-cart"
        >
          <ShoppingCart className="h-4 w-4" />
          Keranjang
        </Button>
        <Button
          className="flex-[1.5] bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
          data-testid="mobile-buy-now"
        >
          <Zap className="h-4 w-4" />
          Beli Sekarang
        </Button>
      </div>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}

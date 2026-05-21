import Link from "next/link";
import {
  ArrowRight,
  Carrot,
  Apple,
  Wheat,
  Flame,
  Sprout,
  FlaskConical,
  Leaf,
  ShoppingBag,
  Star,
  BadgeCheck,
  MapPin,
  Truck,
  ShieldCheck,
  HandCoins,
  Tractor,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { name: "Sayuran", icon: Carrot, tint: "bg-harvest-leaf/15 text-harvest-moss", count: "1.2rb produk" },
  { name: "Buah-buahan", icon: Apple, tint: "bg-harvest-chili/15 text-harvest-chili", count: "860 produk" },
  { name: "Beras", icon: Wheat, tint: "bg-harvest-gold/20 text-harvest-gold", count: "240 produk" },
  { name: "Rempah", icon: Flame, tint: "bg-orange-100 text-orange-700", count: "510 produk" },
  { name: "Bibit Tanaman", icon: Sprout, tint: "bg-lime-100 text-lime-700", count: "320 produk" },
  { name: "Pupuk", icon: FlaskConical, tint: "bg-amber-100 text-amber-700", count: "180 produk" },
  { name: "Produk Organik", icon: Leaf, tint: "bg-emerald-100 text-emerald-700", count: "450 produk" },
  { name: "UMKM Pangan", icon: ShoppingBag, tint: "bg-rose-100 text-rose-700", count: "690 produk" },
];

const PROMO_PRODUCTS = [
  {
    name: "Tomat Ceri Segar",
    price: 18000,
    oldPrice: 25000,
    unit: "/ 500 gr",
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=70",
    farm: "Tani Makmur, Bandung",
    discount: 28,
  },
  {
    name: "Mangga Harum Manis",
    price: 32000,
    oldPrice: 45000,
    unit: "/ kg",
    img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&q=70",
    farm: "Kebun Probolinggo",
    discount: 30,
  },
  {
    name: "Beras Pandan Wangi",
    price: 68000,
    oldPrice: 85000,
    unit: "/ 5 kg",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=70",
    farm: "Sawah Cianjur",
    discount: 20,
  },
  {
    name: "Cabai Rawit Merah",
    price: 22000,
    oldPrice: 35000,
    unit: "/ 250 gr",
    img: "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=400&q=70",
    farm: "Tani Garut",
    discount: 37,
  },
  {
    name: "Bayam Hidroponik",
    price: 9000,
    oldPrice: 12000,
    unit: "/ ikat",
    img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=70",
    farm: "Hijau Lestari",
    discount: 25,
  },
  {
    name: "Alpukat Mentega",
    price: 28000,
    oldPrice: 38000,
    unit: "/ kg",
    img: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=400&q=70",
    farm: "Tani Subang",
    discount: 26,
  },
];

const RECOMMENDED = [
  {
    name: "Kentang Granola",
    price: 15000,
    unit: "/ kg",
    img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=70",
    rating: 4.8,
    sold: "1.2rb",
    location: "Dieng",
  },
  {
    name: "Wortel Organik",
    price: 12000,
    unit: "/ 500 gr",
    img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=70",
    rating: 4.9,
    sold: "980",
    location: "Lembang",
  },
  {
    name: "Pisang Cavendish",
    price: 24000,
    unit: "/ sisir",
    img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=70",
    rating: 4.7,
    sold: "2.1rb",
    location: "Lampung",
  },
  {
    name: "Jahe Merah",
    price: 35000,
    unit: "/ kg",
    img: "https://images.unsplash.com/photo-1599909533730-3c98c1addb4a?w=400&q=70",
    rating: 4.8,
    sold: "640",
    location: "Wonosobo",
  },
  {
    name: "Madu Hutan Asli",
    price: 95000,
    unit: "/ 500 ml",
    img: "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?w=400&q=70",
    rating: 5.0,
    sold: "420",
    location: "Sumbawa",
  },
  {
    name: "Kopi Arabika Gayo",
    price: 78000,
    unit: "/ 250 gr",
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=70",
    rating: 4.9,
    sold: "1.8rb",
    location: "Aceh",
  },
  {
    name: "Bibit Cabai Setan",
    price: 8000,
    unit: "/ pak",
    img: "https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=400&q=70",
    rating: 4.6,
    sold: "320",
    location: "Malang",
  },
  {
    name: "Pupuk Kompos Organik",
    price: 42000,
    unit: "/ 5 kg",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=70",
    rating: 4.8,
    sold: "1.1rb",
    location: "Yogyakarta",
  },
  {
    name: "Salak Pondoh",
    price: 22000,
    unit: "/ kg",
    img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=70",
    rating: 4.7,
    sold: "780",
    location: "Sleman",
  },
  {
    name: "Keripik Singkong UMKM",
    price: 18000,
    unit: "/ 200 gr",
    img: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=70",
    rating: 4.9,
    sold: "2.3rb",
    location: "Cilacap",
  },
];

const FARMERS = [
  {
    name: "Pak Wahyu Pratama",
    farm: "Tani Makmur Bandung",
    location: "Lembang, Jawa Barat",
    rating: 4.9,
    products: 84,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70",
    specialty: "Sayur Hidroponik",
  },
  {
    name: "Bu Siti Marlina",
    farm: "Kebun Probolinggo",
    location: "Probolinggo, Jawa Timur",
    rating: 4.8,
    products: 56,
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=70",
    specialty: "Mangga & Buah Tropis",
  },
  {
    name: "Pak Joko Susilo",
    farm: "Sawah Cianjur",
    location: "Cianjur, Jawa Barat",
    rating: 5.0,
    products: 32,
    img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=70",
    specialty: "Beras Premium",
  },
  {
    name: "Bu Lestari Dewi",
    farm: "Hijau Organik Sleman",
    location: "Sleman, DI Yogyakarta",
    rating: 4.9,
    products: 71,
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=70",
    specialty: "Sayur & Buah Organik",
  },
];

const TRUST = [
  { icon: Truck, title: "Pengiriman Cepat", body: "Sampai 1-2 hari" },
  { icon: ShieldCheck, title: "100% Segar", body: "Garansi ganti rugi" },
  { icon: HandCoins, title: "Harga dari Petani", body: "Tanpa tengkulak" },
  { icon: Tractor, title: "Petani Terverifikasi", body: "Cek KTP & lahan" },
];

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative overflow-hidden bg-gradient-to-br from-harvest-moss via-harvest-moss to-emerald-900 text-harvest-cream"
      >
        <div className="absolute inset-0 grain opacity-30" />
        <div className="absolute -right-20 top-10 hidden h-72 w-72 rounded-full bg-harvest-gold/30 blur-3xl md:block" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-harvest-lime/20 blur-3xl" />

        <div className="container relative grid items-center gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7 animate-fade-up">
            <span
              data-testid="hero-eyebrow"
              className="inline-flex items-center gap-2 rounded-full bg-harvest-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-harvest-amber"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-harvest-amber" />
              Marketplace Petani Indonesia
            </span>
            <h1
              data-testid="hero-title"
              className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
            >
              Belanja Hasil Tani
              <br />
              <span className="text-harvest-amber italic">Langsung dari Petani</span>
            </h1>
            <p
              data-testid="hero-description"
              className="mt-5 max-w-xl text-base leading-relaxed text-harvest-cream/85 md:text-lg"
            >
              Sayur, buah, beras, rempah, bibit, pupuk, dan produk UMKM pangan lokal — segar dari kebun, harga adil untuk petani.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
                data-testid="hero-cta-shop"
              >
                <Link href="/produk">
                  Mulai Belanja
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-harvest-cream/40 bg-transparent text-harvest-cream hover:bg-harvest-cream/10 hover:text-harvest-cream"
                data-testid="hero-cta-farmer"
              >
                <Link href="/jadi-penjual">Daftar Jadi Petani</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-harvest-cream/15 pt-6 sm:grid-cols-4">
              {TRUST.map((t) => (
                <div key={t.title} className="flex items-center gap-3" data-testid={`trust-${t.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-harvest-cream/10 text-harvest-amber">
                    <t.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{t.title}</p>
                    <p className="text-[11px] text-harvest-cream/70">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-harvest-cream/10 ring-1 ring-harvest-cream/20">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=70"
                  alt="Pasar sayur"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-8 space-y-3">
                <div className="aspect-square overflow-hidden rounded-2xl bg-harvest-cream/10 ring-1 ring-harvest-cream/20">
                  <img
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=70"
                    alt="Hasil panen"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl bg-harvest-cream p-4 text-harvest-soil shadow-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-harvest-moss">Panen Hari Ini</p>
                  <p className="mt-1 font-serif text-2xl">12.480 kg</p>
                  <p className="text-xs text-muted-foreground">dari 142 petani aktif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section data-testid="categories-section" className="border-b border-border bg-card">
        <div className="container py-12 md:py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-gold">
                Kategori Pilihan
              </p>
              <h2 className="mt-1 font-serif text-2xl tracking-tight md:text-3xl">
                Cari sesuai kebutuhan
              </h2>
            </div>
            <Link
              href="/kategori"
              className="hidden text-sm font-medium text-harvest-moss hover:underline md:inline-block"
              data-testid="see-all-categories"
            >
              Lihat semua →
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/kategori/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                data-testid={`category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-harvest-moss/40 hover:shadow-md"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-full ${cat.tint} transition-transform group-hover:scale-110`}>
                  <cat.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <span className="text-xs font-semibold leading-tight md:text-sm">
                  {cat.name}
                </span>
                <span className="text-[10px] text-muted-foreground">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO PANEN HARI INI */}
      <section data-testid="promo-section" className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-harvest-chili/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-harvest-chili">
                <Flame className="h-3.5 w-3.5" /> Promo Spesial
              </span>
              <h2 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">
                Promo Panen Hari Ini
              </h2>
              <p className="text-sm text-muted-foreground">
                Berakhir dalam 23 jam · stok terbatas
              </p>
            </div>
            <Link
              href="/promo"
              className="text-sm font-medium text-harvest-moss hover:underline"
              data-testid="see-all-promo"
            >
              Lihat semua promo →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4">
            {PROMO_PRODUCTS.map((p) => (
              <article
                key={p.name}
                data-testid={`promo-card-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-harvest-chili px-2 py-0.5 text-[10px] font-bold text-white shadow">
                    -{p.discount}%
                  </span>
                  <span className="absolute right-2 top-2 rounded-md bg-harvest-gold px-2 py-0.5 text-[10px] font-bold text-harvest-soil shadow">
                    PROMO
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold">{p.name}</h3>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {p.farm}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-harvest-moss">
                      {rupiah(p.price)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{p.unit}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-through">
                    {rupiah(p.oldPrice)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REKOMENDASI HASIL TANI */}
      <section data-testid="recommended-section" className="border-y border-border bg-secondary/40">
        <div className="container py-12 md:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-gold">
                Untukmu
              </p>
              <h2 className="mt-1 font-serif text-2xl tracking-tight md:text-3xl">
                Rekomendasi Hasil Tani
              </h2>
              <p className="text-sm text-muted-foreground">
                Dipilih berdasarkan musim panen dan lokasi terdekat
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Semua", "Sayur", "Buah", "Beras", "Rempah", "Organik"].map((f, i) => (
                <button
                  key={f}
                  data-testid={`recommend-filter-${f.toLowerCase()}`}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    i === 0
                      ? "border-harvest-moss bg-harvest-moss text-harvest-cream"
                      : "border-border bg-card hover:border-harvest-moss/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
            {RECOMMENDED.map((p) => (
              <article
                key={p.name}
                data-testid={`product-card-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold">{p.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-bold text-harvest-moss">
                      {rupiah(p.price)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{p.unit}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-harvest-gold text-harvest-gold" />
                      <span className="font-semibold text-foreground">{p.rating}</span>
                      <span>· {p.sold} terjual</span>
                    </span>
                  </div>
                  <p className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.location}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="border-harvest-moss/40 text-harvest-moss hover:bg-harvest-moss/10"
              data-testid="load-more-products"
            >
              <Link href="/produk">Lihat semua produk →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PETANI PILIHAN */}
      <section data-testid="farmers-section" className="bg-background">
        <div className="container py-12 md:py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-harvest-moss/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-harvest-moss">
                <BadgeCheck className="h-3.5 w-3.5" /> Terverifikasi
              </span>
              <h2 className="mt-2 font-serif text-2xl tracking-tight md:text-3xl">
                Petani Pilihan
              </h2>
              <p className="text-sm text-muted-foreground">
                Bertemu langsung dengan petani yang menanamnya untukmu
              </p>
            </div>
            <Link
              href="/petani"
              className="text-sm font-medium text-harvest-moss hover:underline"
              data-testid="see-all-farmers"
            >
              Lihat semua petani →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FARMERS.map((f) => (
              <article
                key={f.name}
                data-testid={`farmer-card-${f.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-harvest-moss/40 hover:shadow-xl"
              >
                <div className="relative h-24 bg-gradient-to-br from-harvest-moss via-harvest-leaf to-harvest-lime">
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-harvest-cream px-2 py-0.5 text-[10px] font-bold text-harvest-moss shadow">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                </div>
                <div className="relative px-4 pb-5">
                  <div className="-mt-10 mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-card bg-secondary">
                    <img src={f.img} alt={f.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="text-base font-semibold leading-tight">{f.name}</h3>
                  <p className="text-xs text-muted-foreground">{f.farm}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {f.location}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-harvest-gold text-harvest-gold" />
                      <span className="font-bold text-foreground">{f.rating}</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{f.products}</span> produk
                    </span>
                  </div>
                  <span className="mt-3 inline-block rounded-md bg-harvest-lime/20 px-2 py-0.5 text-[10px] font-semibold text-harvest-moss">
                    {f.specialty}
                  </span>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-4 w-full border-harvest-moss/30 text-harvest-moss hover:bg-harvest-moss hover:text-harvest-cream"
                    data-testid={`farmer-visit-${f.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href="/petani">Kunjungi Toko</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JADI PENJUAL CTA */}
      <section className="bg-harvest-soil text-harvest-cream" data-testid="seller-cta-section">
        <div className="container grid items-center gap-8 py-14 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-harvest-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-harvest-amber">
              <Tractor className="h-3.5 w-3.5" /> Untuk Petani & UMKM
            </span>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
              Jual hasil panenmu, <span className="text-harvest-amber italic">dapatkan harga terbaik</span>
            </h2>
            <p className="mt-3 max-w-xl text-harvest-cream/80">
              Gabung dengan 142+ petani & UMKM yang sudah memasarkan produknya tanpa tengkulak. Komisi flat 5%, pencairan harian.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
            <Button
              asChild
              size="lg"
              className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
              data-testid="seller-cta-btn"
            >
              <Link href="/jadi-penjual">
                Daftar Jadi Penjual <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="/panduan-penjual"
              className="text-sm text-harvest-cream/70 underline-offset-4 hover:underline"
            >
              Pelajari cara berjualan →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

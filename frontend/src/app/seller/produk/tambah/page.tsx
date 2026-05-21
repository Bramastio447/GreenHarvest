"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ImagePlus,
  X,
  Star,
  Camera,
  Leaf,
  Info,
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  Tag,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  LOCATIONS,
  rupiah,
  type ProductCategory,
} from "@/lib/products";

// =============== TYPES ===============

const UNIT_OPTIONS = [
  "kg",
  "500 gr",
  "250 gr",
  "ikat",
  "buah",
  "sisir",
  "pack",
  "botol",
  "pak",
  "L",
] as const;

interface ImageSlot {
  id: string;
  url: string;
  name: string;
  isPrimary: boolean;
}

// =============== HELPERS ===============

function Section({
  step,
  title,
  desc,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  desc?: string;
  icon: typeof Info;
  children: React.ReactNode;
}) {
  return (
    <section
      data-testid={`section-${step}`}
      className="rounded-xl border border-border bg-card p-5 md:p-6"
    >
      <header className="mb-5 flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-harvest-moss text-sm font-bold text-harvest-cream">
          {step}
        </span>
        <div>
          <h2 className="inline-flex items-center gap-2 font-serif text-xl tracking-tight">
            <Icon className="h-5 w-5 text-harvest-moss" />
            {title}
          </h2>
          {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-harvest-chili"> *</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p
          data-testid={`error-${id}`}
          className="inline-flex items-center gap-1 text-[11px] text-harvest-chili"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// =============== PAGE ===============

export default function TambahProdukPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [organic, setOrganic] = useState(false);
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<(typeof UNIT_OPTIONS)[number]>("kg");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [images, setImages] = useState<ImageSlot[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string } | null>(null);

  // Image handling — local preview only (no upload)
  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 5 - images.length;
    const slice = Array.from(files).slice(0, remaining);
    const newSlots: ImageSlot[] = slice.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      url: URL.createObjectURL(f),
      name: f.name,
      isPrimary: images.length === 0 && i === 0,
    }));
    setImages((prev) => [...prev, ...newSlots]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (!next.some((x) => x.isPrimary) && next.length > 0)
        next[0].isPrimary = true;
      return next;
    });
  };

  const setPrimary = (id: string) =>
    setImages((prev) => prev.map((x) => ({ ...x, isPrimary: x.id === id })));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3)
      e.name = "Nama produk minimal 3 karakter";
    if (!category) e.category = "Pilih salah satu kategori";
    if (!price || Number(price) <= 0) e.price = "Harga harus lebih dari 0";
    if (!stock || Number(stock) < 0) e.stock = "Stok tidak boleh negatif";
    if (!description.trim() || description.trim().length < 20)
      e.description = "Deskripsi minimal 20 karakter";
    if (!location) e.location = "Pilih lokasi kebun";
    if (!harvestDate) e.harvestDate = "Tanggal panen wajib diisi";
    if (images.length === 0) e.images = "Tambahkan minimal 1 foto produk";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (action: "draft" | "publish") => {
    if (action === "publish" && !validate()) {
      const first = document.querySelector("[data-testid^='error-']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess({ name: name || "Produk baru" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  };

  // Preview snippet
  const previewPrice = price ? Number(price) : 0;
  const previewName = name.trim() || "Nama produk akan muncul di sini";

  if (success) {
    return (
      <div data-testid="success-screen" className="mx-auto max-w-xl py-10 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-harvest-moss/10">
            <CheckCircle2 className="h-12 w-12 text-harvest-moss" strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 font-serif text-3xl tracking-tight md:text-4xl">
            Produk berhasil ditambahkan!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{success.name}</span>{" "}
            sudah masuk ke etalase toko-mu.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
              data-testid="success-list-btn"
            >
              <Link href="/seller/produk">Lihat Daftar Produk</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setSuccess(null);
                setName("");
                setCategory("");
                setOrganic(false);
                setPrice("");
                setStock("");
                setDescription("");
                setLocation("");
                setImages([]);
                setErrors({});
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              data-testid="success-add-more-btn"
            >
              Tambah Produk Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="tambah-produk-page" className="space-y-6 pb-24">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            data-testid="back-link"
            className="-ml-2 text-muted-foreground"
          >
            <Link href="/seller/produk">
              <ChevronLeft className="h-4 w-4" />
              Kembali ke Kelola Produk
            </Link>
          </Button>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-harvest-gold">
            Etalase Toko
          </p>
          <h1
            data-testid="page-title"
            className="mt-1 font-serif text-3xl tracking-tight md:text-4xl"
          >
            Tambah Produk Baru
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lengkapi detail panen agar pembeli mudah menemukan produkmu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={submitting}
            data-testid="save-draft-btn"
          >
            Simpan Draft
          </Button>
          <Button
            onClick={() => handleSubmit("publish")}
            disabled={submitting}
            className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
            data-testid="publish-btn"
          >
            {submitting ? "Menyimpan…" : "Publikasikan"}
            {!submitting && <Sparkles className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT FORM */}
        <div className="space-y-5">
          {/* 1. Informasi Dasar */}
          <Section
            step={1}
            title="Informasi Dasar"
            desc="Nama dan kategori menentukan visibilitas produk di pencarian."
            icon={Info}
          >
            <div className="space-y-4">
              <Field
                id="name"
                label="Nama Produk"
                required
                error={errors.name}
                hint="Contoh: Tomat Ceri Hidroponik Segar — 500 gr"
              >
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sebut varietas + ciri khas + ukuran"
                  data-testid="input-name"
                  maxLength={80}
                />
                <p className="text-right text-[10px] text-muted-foreground">
                  {name.length}/80
                </p>
              </Field>

              <Field id="category" label="Kategori" required error={errors.category}>
                <div
                  className="flex flex-wrap gap-2"
                  data-testid="category-chips"
                  role="radiogroup"
                  aria-label="Kategori"
                >
                  {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((c) => {
                    const active = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCategory(c)}
                        data-testid={`category-${c}`}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
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
              </Field>

              <label
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-harvest-moss/40 has-[:checked]:border-harvest-moss has-[:checked]:bg-harvest-moss/5"
                data-testid="organic-toggle"
              >
                <input
                  type="checkbox"
                  checked={organic}
                  onChange={(e) => setOrganic(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-harvest-moss"
                  data-testid="organic-checkbox"
                />
                <span className="flex-1">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                    <Leaf className="h-4 w-4 text-harvest-moss" />
                    Produk Organik
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Centang jika produk ditanam tanpa pestisida sintetis & pupuk kimia. Akan diberi badge organik di etalase.
                  </p>
                </span>
              </label>
            </div>
          </Section>

          {/* 2. Foto Produk */}
          <Section
            step={2}
            title="Foto Produk"
            desc="Maksimal 5 foto. Foto pertama akan jadi cover."
            icon={Camera}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(e) => onPickFiles(e.target.files)}
              data-testid="file-input"
            />
            <div
              className="grid grid-cols-3 gap-3 sm:grid-cols-5"
              data-testid="image-grid"
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  data-testid={`image-slot-${img.id}`}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border-2",
                    img.isPrimary
                      ? "border-harvest-moss ring-2 ring-harvest-moss/20"
                      : "border-border"
                  )}
                >
                  <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-harvest-moss px-1.5 py-0.5 text-[10px] font-bold text-harvest-cream">
                      <Star className="h-3 w-3 fill-current" /> Utama
                    </span>
                  )}
                  <div className="absolute inset-x-1.5 bottom-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(img.id)}
                        className="flex-1 rounded bg-card/95 px-1 py-1 text-[10px] font-bold backdrop-blur hover:bg-harvest-moss hover:text-harvest-cream"
                        data-testid={`set-primary-${img.id}`}
                      >
                        Set Utama
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="grid h-7 w-7 place-items-center rounded bg-harvest-chili/95 text-harvest-cream hover:bg-harvest-chili"
                      data-testid={`remove-img-${img.id}`}
                      aria-label="Hapus foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="upload-trigger"
                  className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-secondary/40 p-3 text-center transition-colors hover:border-harvest-moss/60 hover:bg-harvest-moss/5"
                >
                  <ImagePlus className="h-7 w-7 text-muted-foreground group-hover:text-harvest-moss" />
                  <p className="text-[11px] font-semibold text-muted-foreground group-hover:text-harvest-moss">
                    {images.length === 0 ? "Tambah Foto" : "Tambah Lagi"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {images.length}/5 · JPG/PNG · max 5MB
                  </p>
                </button>
              )}
            </div>
            {errors.images && (
              <p
                data-testid="error-images"
                className="mt-2 inline-flex items-center gap-1 text-[11px] text-harvest-chili"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.images}
              </p>
            )}
            <div className="mt-3 rounded-md bg-harvest-moss/5 p-3 text-[11px] text-muted-foreground">
              💡 Tips: foto outdoor dengan cahaya alami menampilkan kesegaran 2× lebih jelas. Hindari filter berlebihan.
            </div>
          </Section>

          {/* 3. Harga & Stok */}
          <Section
            step={3}
            title="Harga, Satuan & Stok"
            desc="Tetapkan harga jujur — Green Harvest hanya potong komisi 5%."
            icon={Tag}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field
                  id="price"
                  label="Harga"
                  required
                  error={errors.price}
                  hint="Belum termasuk ongkir & komisi platform"
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      id="price"
                      type="number"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      data-testid="input-price"
                      className="pl-10"
                    />
                  </div>
                </Field>
              </div>

              <Field id="unit" label="Satuan" required>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value as (typeof UNIT_OPTIONS)[number])
                  }
                  data-testid="select-unit"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-harvest-moss/40"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      per {u}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="sm:col-span-3">
                <Field
                  id="stock"
                  label="Jumlah Stok"
                  required
                  error={errors.stock}
                  hint="Berapa banyak yang bisa dijual hari ini?"
                >
                  <Input
                    id="stock"
                    type="number"
                    inputMode="numeric"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Mis. 50"
                    data-testid="input-stock"
                  />
                </Field>
              </div>
            </div>
          </Section>

          {/* 4. Detail Produk */}
          <Section
            step={4}
            title="Detail Panen"
            desc="Cerita di balik produkmu meningkatkan konversi pembelian."
            icon={FileText}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="location" label="Lokasi Kebun" required error={errors.location}>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    data-testid="select-location"
                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-harvest-moss/40"
                  >
                    <option value="">Pilih lokasi</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field
                id="harvestDate"
                label="Tanggal Panen"
                required
                error={errors.harvestDate}
                hint="Pembeli melihat kapan produk dipanen"
              >
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="harvestDate"
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    data-testid="input-harvest-date"
                    className="pl-10"
                  />
                </div>
              </Field>

              <div className="sm:col-span-2">
                <Field
                  id="description"
                  label="Deskripsi Produk"
                  required
                  error={errors.description}
                  hint="Ceritakan varietas, kondisi tanam, rasa, & tips penyimpanan"
                >
                  <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Tomat ceri hidroponik dipanen pagi tadi dari kebun di Lembang. Manis, berair, dan kulit tipis. Cocok untuk salad, pasta, atau ditaruh di lunch box. Simpan di kulkas untuk awet sampai 7 hari…"
                    data-testid="textarea-description"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-harvest-moss/40"
                  />
                  <p className="text-right text-[10px] text-muted-foreground">
                    {description.length} karakter (min. 20)
                  </p>
                </Field>
              </div>
            </div>
          </Section>
        </div>

        {/* RIGHT: Preview + Tips */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" data-testid="sidebar-preview">
          <div className="rounded-xl border border-border bg-card">
            <p className="border-b border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Pratinjau Card
            </p>
            <div className="p-4">
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="aspect-square overflow-hidden bg-secondary">
                  {images.find((x) => x.isPrimary)?.url ? (
                    <img
                      src={images.find((x) => x.isPrimary)!.url}
                      alt={previewName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Camera className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold">{previewName}</p>
                  {organic && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <Leaf className="h-3 w-3" /> ORGANIK
                    </span>
                  )}
                  <p className="text-[11px] text-muted-foreground">Tani Makmur</p>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-base font-bold text-harvest-moss">
                      {previewPrice ? rupiah(previewPrice) : "Rp —"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">/ {unit}</span>
                  </div>
                  {location && (
                    <p className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-gradient-to-br from-harvest-moss/5 to-harvest-gold/5 p-5">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-harvest-moss">
              <Sparkles className="h-4 w-4" />
              Tips Listing Cepat Laku
            </p>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {[
                "Foto outdoor + properti rumah → +35% klik",
                "Sebutkan varietas spesifik (mis. Tomat Ceri vs Tomat)",
                "Tulis tanggal panen jelas → kepercayaan +2×",
                "Harga ≤ 10% di atas pasar tradisional → balance value & profit",
                "Stok ≥ 30 dapat priority feed homepage",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-harvest-gold" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800">
              <Info className="h-4 w-4" />
              Komisi & Pembayaran
            </p>
            <p className="mt-1 text-xs text-amber-900/80">
              Green Harvest hanya potong{" "}
              <span className="font-bold">komisi flat 5%</span> per transaksi. Pencairan harian otomatis ke rekening kamu setelah pesanan diterima pembeli.
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile sticky bottom action */}
      <div
        data-testid="mobile-sticky-action"
        className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-card p-3 shadow-lg lg:hidden"
      >
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleSubmit("draft")}
          disabled={submitting}
          data-testid="mobile-save-draft-btn"
        >
          Simpan Draft
        </Button>
        <Button
          className="flex-[1.5] bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
          onClick={() => handleSubmit("publish")}
          disabled={submitting}
          data-testid="mobile-publish-btn"
        >
          {submitting ? "Menyimpan…" : "Publikasikan"}
          {!submitting && <Sparkles className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

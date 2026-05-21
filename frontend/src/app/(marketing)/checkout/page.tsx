"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  Truck,
  CreditCard,
  Wallet,
  QrCode,
  Banknote,
  CheckCircle2,
  Clock,
  Store,
  ShieldCheck,
  PackageCheck,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { rupiah } from "@/lib/products";
import { useCart } from "@/lib/cart";

// =============== TYPES & CONFIG ===============

type DeliveryKey = "regular" | "sameday" | "pickup";
type PaymentKey = "transfer" | "qris" | "cod" | "ewallet";

interface DeliveryOption {
  key: DeliveryKey;
  title: string;
  desc: string;
  eta: string;
  fee: number;
  icon: typeof Truck;
}

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    key: "regular",
    title: "Pengiriman Reguler",
    desc: "Ekspedisi tepercaya · kemasan suhu terjaga",
    eta: "2-3 hari kerja",
    fee: 15000,
    icon: Truck,
  },
  {
    key: "sameday",
    title: "Same Day Delivery",
    desc: "Khusus Jabodetabek · order sebelum 10:00 WIB",
    eta: "Hari ini",
    fee: 25000,
    icon: Clock,
  },
  {
    key: "pickup",
    title: "Ambil di Lokasi Petani",
    desc: "Datang langsung ke kebun · gratis",
    eta: "Diatur dengan petani",
    fee: 0,
    icon: Store,
  },
];

interface PaymentOption {
  key: PaymentKey;
  title: string;
  desc: string;
  icon: typeof CreditCard;
  options?: { id: string; label: string }[];
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: "transfer",
    title: "Transfer Bank",
    desc: "Virtual Account · konfirmasi otomatis",
    icon: Banknote,
    options: [
      { id: "bca", label: "BCA" },
      { id: "mandiri", label: "Mandiri" },
      { id: "bni", label: "BNI" },
      { id: "bri", label: "BRI" },
    ],
  },
  {
    key: "qris",
    title: "QRIS",
    desc: "Scan dari semua aplikasi mobile banking",
    icon: QrCode,
  },
  {
    key: "ewallet",
    title: "E-Wallet",
    desc: "GoPay, OVO, Dana, ShopeePay",
    icon: Wallet,
    options: [
      { id: "gopay", label: "GoPay" },
      { id: "ovo", label: "OVO" },
      { id: "dana", label: "Dana" },
      { id: "shopeepay", label: "ShopeePay" },
    ],
  },
  {
    key: "cod",
    title: "COD (Bayar di Tempat)",
    desc: "Bayar tunai saat barang diterima",
    icon: CreditCard,
  },
];

// =============== SUB COMPONENTS ===============

function SectionCard({
  step,
  title,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <section
      data-testid={`section-${step}`}
      className="rounded-xl border border-border bg-card p-5 md:p-6"
    >
      <header className="mb-4 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-harvest-moss text-sm font-bold text-harvest-cream">
          {step}
        </span>
        <h2 className="inline-flex items-center gap-2 font-serif text-xl">
          <Icon className="h-5 w-5 text-harvest-moss" />
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function FieldRow({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-harvest-chili"> *</span>}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] text-harvest-chili" data-testid={`error-${id}`}>
          {error}
        </p>
      )}
    </div>
  );
}

// =============== SUCCESS SCREEN ===============

function SuccessScreen({
  orderId,
  total,
  payment,
}: {
  orderId: string;
  total: number;
  payment: PaymentKey;
}) {
  const paymentLabel =
    payment === "cod"
      ? "Bayar saat barang diterima"
      : payment === "qris"
        ? "Scan QRIS"
        : payment === "transfer"
          ? "Transfer ke Virtual Account"
          : "Bayar melalui aplikasi e-wallet";

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center md:p-10">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-harvest-moss/10">
          <CheckCircle2 className="h-12 w-12 text-harvest-moss" strokeWidth={1.75} />
        </div>
        <h1 className="mt-6 font-serif text-3xl tracking-tight md:text-4xl">
          Pesanan berhasil dibuat!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terima kasih telah mendukung petani Indonesia.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Nomor Pesanan
              </p>
              <p className="font-mono text-lg font-bold" data-testid="order-id">
                {orderId}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText(orderId)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:border-harvest-moss/40 hover:text-harvest-moss"
              data-testid="copy-order-id"
            >
              <Copy className="h-3.5 w-3.5" /> Salin
            </button>
          </div>
          <Separator className="my-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Pembayaran</span>
            <span className="font-serif text-xl font-bold text-harvest-moss" data-testid="success-total">
              {rupiah(total)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Metode</span>
            <span className="font-medium text-foreground">{paymentLabel}</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Detail pesanan dan instruksi pembayaran telah dikirim ke email Anda.
          {payment !== "cod" &&
            " Selesaikan pembayaran dalam 24 jam agar pesanan diproses."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
            data-testid="success-track-btn"
          >
            <Link href="/dashboard">Lihat Pesanan Saya</Link>
          </Button>
          <Button asChild size="lg" variant="outline" data-testid="success-shop-btn">
            <Link href="/produk">
              Lanjut Belanja
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============== PAGE ===============

export default function CheckoutPage() {
  const cart = useCart();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [recipient, setRecipient] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [province, setProvince] = useState("");
  const [notes, setNotes] = useState("");

  const [delivery, setDelivery] = useState<DeliveryKey>("regular");
  const [payment, setPayment] = useState<PaymentKey>("transfer");
  const [paymentSub, setPaymentSub] = useState<string>("bca");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<{
    orderId: string;
    total: number;
    payment: PaymentKey;
  } | null>(null);

  // Order math
  const subtotal = cart.subtotal;
  const deliveryOpt = DELIVERY_OPTIONS.find((d) => d.key === delivery)!;
  const shipping = deliveryOpt.fee;
  const serviceFee = payment === "cod" ? 5000 : 2500;
  const total = subtotal + shipping + serviceFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nama wajib diisi";
    if (!/^[0-9+]{8,15}$/.test(phone.replace(/[\s-]/g, "")))
      e.phone = "Nomor HP tidak valid (8–15 digit)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email tidak valid";
    if (!recipient.trim()) e.recipient = "Nama penerima wajib diisi";
    if (!street.trim()) e.street = "Alamat lengkap wajib diisi";
    if (!city.trim()) e.city = "Kota wajib diisi";
    if (!province.trim()) e.province = "Provinsi wajib diisi";
    if (!/^\d{5}$/.test(postal)) e.postal = "Kode pos harus 5 digit";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    if (!validate()) {
      // scroll to first error
      const first = document.querySelector("[data-testid^='error-']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    // Simulate processing
    setTimeout(() => {
      const orderId = `GH-${new Date().getFullYear()}${String(
        Math.floor(Math.random() * 1_000_000)
      ).padStart(6, "0")}`;
      setSuccessOrder({ orderId, total, payment });
      cart.clear();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  };

  // ===== Render success =====
  if (successOrder) {
    return (
      <SuccessScreen
        orderId={successOrder.orderId}
        total={successOrder.total}
        payment={successOrder.payment}
      />
    );
  }

  // ===== Render empty =====
  if (cart.hydrated && cart.lines.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-3xl">Tidak ada produk untuk checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keranjang kamu kosong. Yuk pilih produk dulu sebelum checkout.
        </p>
        <Button asChild className="mt-6" data-testid="empty-shop-btn">
          <Link href="/produk">
            Mulai Belanja <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  // ===== Render checkout =====
  return (
    <div className="bg-secondary/30">
      {/* BREADCRUMB */}
      <div className="border-b border-border bg-card">
        <div className="container py-3">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/keranjang" className="hover:text-foreground">Keranjang</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="font-serif text-3xl tracking-tight md:text-4xl">Checkout</h1>
          <Button
            asChild
            variant="ghost"
            size="sm"
            data-testid="back-to-cart-btn"
            className="text-muted-foreground"
          >
            <Link href="/keranjang">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Keranjang
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* LEFT FORMS */}
          <div className="space-y-5">
            {/* 1. Buyer info */}
            <SectionCard step={1} title="Informasi Pembeli" icon={User}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow id="name" label="Nama Lengkap" required error={errors.name}>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rizki Pratama"
                    data-testid="buyer-name-input"
                  />
                </FieldRow>
                <FieldRow id="phone" label="Nomor HP / WhatsApp" required error={errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    data-testid="buyer-phone-input"
                  />
                </FieldRow>
                <FieldRow id="email" label="Email" required error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@kamu.com"
                    data-testid="buyer-email-input"
                    className="sm:col-span-2"
                  />
                </FieldRow>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Resi & invoice akan dikirim ke email & WhatsApp di atas.
              </p>
            </SectionCard>

            {/* 2. Address */}
            <SectionCard step={2} title="Alamat Pengiriman" icon={MapPin}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow
                  id="recipient"
                  label="Nama Penerima"
                  required
                  error={errors.recipient}
                >
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Sama dengan pembeli? Boleh diisi sama."
                    data-testid="address-recipient-input"
                  />
                </FieldRow>
                <FieldRow id="province" label="Provinsi" required error={errors.province}>
                  <select
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    data-testid="address-province-select"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-harvest-moss/40"
                  >
                    <option value="">Pilih provinsi</option>
                    {[
                      "DKI Jakarta",
                      "Jawa Barat",
                      "Jawa Tengah",
                      "DI Yogyakarta",
                      "Jawa Timur",
                      "Banten",
                      "Bali",
                      "Sumatera Utara",
                      "Sumatera Selatan",
                      "Kalimantan Timur",
                      "Sulawesi Selatan",
                    ].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </FieldRow>

                <div className="sm:col-span-2">
                  <FieldRow id="street" label="Alamat Lengkap" required error={errors.street}>
                    <textarea
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                      rows={3}
                      data-testid="address-street-input"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-harvest-moss/40"
                    />
                  </FieldRow>
                </div>

                <FieldRow id="city" label="Kota / Kabupaten" required error={errors.city}>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan"
                    data-testid="address-city-input"
                  />
                </FieldRow>
                <FieldRow id="postal" label="Kode Pos" required error={errors.postal}>
                  <Input
                    id="postal"
                    inputMode="numeric"
                    maxLength={5}
                    value={postal}
                    onChange={(e) => setPostal(e.target.value.replace(/\D/g, ""))}
                    placeholder="12345"
                    data-testid="address-postal-input"
                  />
                </FieldRow>

                <div className="sm:col-span-2">
                  <FieldRow id="notes" label="Catatan untuk Kurir (opsional)">
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Patokan, instruksi khusus, dst."
                      data-testid="address-notes-input"
                    />
                  </FieldRow>
                </div>
              </div>
            </SectionCard>

            {/* 3. Delivery method */}
            <SectionCard step={3} title="Metode Pengiriman" icon={Truck}>
              <div className="grid gap-3 sm:grid-cols-3">
                {DELIVERY_OPTIONS.map((opt) => {
                  const active = delivery === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setDelivery(opt.key)}
                      data-testid={`delivery-${opt.key}`}
                      className={cn(
                        "flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
                        active
                          ? "border-harvest-moss bg-harvest-moss/5 shadow-sm"
                          : "border-border bg-card hover:border-harvest-moss/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <opt.icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-harvest-moss" : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "grid h-4 w-4 place-items-center rounded-full border-2",
                            active
                              ? "border-harvest-moss bg-harvest-moss"
                              : "border-border"
                          )}
                        >
                          {active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-harvest-cream" />
                          )}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{opt.title}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      <div className="mt-auto flex items-baseline justify-between gap-2 pt-1">
                        <span className="text-[11px] text-muted-foreground">{opt.eta}</span>
                        <span className="font-bold text-harvest-moss">
                          {opt.fee === 0 ? "GRATIS" : rupiah(opt.fee)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* 4. Payment */}
            <SectionCard step={4} title="Metode Pembayaran" icon={CreditCard}>
              <ul className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const active = payment === opt.key;
                  return (
                    <li key={opt.key}>
                      <button
                        type="button"
                        onClick={() => {
                          setPayment(opt.key);
                          if (opt.options) setPaymentSub(opt.options[0].id);
                        }}
                        data-testid={`payment-${opt.key}`}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                          active
                            ? "border-harvest-moss bg-harvest-moss/5"
                            : "border-border bg-card hover:border-harvest-moss/40"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-10 w-10 shrink-0 place-items-center rounded-md",
                            active
                              ? "bg-harvest-moss text-harvest-cream"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          <opt.icon className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{opt.title}</p>
                          <p className="text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                        <span
                          className={cn(
                            "grid h-4 w-4 place-items-center rounded-full border-2",
                            active ? "border-harvest-moss bg-harvest-moss" : "border-border"
                          )}
                        >
                          {active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-harvest-cream" />
                          )}
                        </span>
                      </button>

                      {/* Sub-options for transfer/ewallet */}
                      {active && opt.options && (
                        <div
                          data-testid={`payment-suboptions-${opt.key}`}
                          className="mt-2 grid grid-cols-2 gap-2 pl-13 sm:grid-cols-4"
                        >
                          {opt.options.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setPaymentSub(sub.id)}
                              data-testid={`payment-sub-${sub.id}`}
                              className={cn(
                                "rounded-md border px-3 py-2 text-center text-xs font-bold transition-colors",
                                paymentSub === sub.id
                                  ? "border-harvest-moss bg-harvest-moss text-harvest-cream"
                                  : "border-border bg-card hover:border-harvest-moss/40"
                              )}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {payment === "cod" && (
                <p className="mt-4 rounded-md bg-harvest-gold/10 p-3 text-xs text-harvest-soil">
                  ⚠️ COD ada biaya layanan tambahan{" "}
                  <span className="font-bold">{rupiah(5000)}</span>. Pastikan ada yang menerima di alamat saat kurir datang.
                </p>
              )}
            </SectionCard>
          </div>

          {/* RIGHT SUMMARY */}
          <aside className="lg:sticky lg:top-32 lg:self-start" data-testid="checkout-summary">
            <div className="rounded-xl border border-border bg-card">
              <div className="p-5">
                <h2 className="font-serif text-xl">Ringkasan Pesanan</h2>
              </div>
              <Separator />

              {/* Items */}
              <div className="max-h-72 space-y-3 overflow-y-auto p-5">
                {cart.lines.map((line) => (
                  <div
                    key={line.product.id}
                    data-testid={`summary-item-${line.product.id}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                      <img
                        src={line.product.img}
                        alt={line.product.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-harvest-moss px-1 text-[10px] font-bold text-harvest-cream">
                        {line.qty}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-1 text-sm font-medium">{line.product.name}</p>
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">
                        {line.product.farmer}
                      </p>
                      <p className="mt-auto text-sm font-bold text-harvest-moss">
                        {rupiah(line.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Math */}
              <dl className="space-y-2.5 p-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Subtotal produk ({cart.totalItems})
                  </dt>
                  <dd className="font-semibold" data-testid="summary-subtotal">
                    {rupiah(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Ongkir ({deliveryOpt.title})
                  </dt>
                  <dd className="font-semibold" data-testid="summary-shipping">
                    {shipping === 0 ? "GRATIS" : rupiah(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Biaya layanan</dt>
                  <dd className="font-semibold" data-testid="summary-service">
                    {rupiah(serviceFee)}
                  </dd>
                </div>
              </dl>

              <Separator />

              <div className="p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">Total Pembayaran</span>
                  <span
                    className="font-serif text-2xl font-bold text-harvest-moss"
                    data-testid="summary-total"
                  >
                    {rupiah(total)}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="mt-5 w-full bg-harvest-gold text-harvest-soil hover:bg-harvest-amber disabled:opacity-60"
                  onClick={placeOrder}
                  disabled={submitting}
                  data-testid="place-order-btn"
                >
                  {submitting ? "Memproses…" : "Buat Pesanan"}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </Button>

                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Dengan menekan tombol di atas, kamu setuju dengan{" "}
                  <Link href="/syarat-ketentuan" className="text-harvest-moss hover:underline">
                    Syarat & Ketentuan
                  </Link>{" "}
                  Green Harvest.
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-border pt-4 text-[11px] text-muted-foreground">
                  <li className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-harvest-moss" />
                    Garansi 100% segar atau uang kembali
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <PackageCheck className="h-3.5 w-3.5 text-harvest-moss" />
                    Kemasan eco-friendly, suhu terjaga
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE STICKY ACTION */}
      <div
        data-testid="mobile-sticky-checkout"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 shadow-lg lg:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Total ({cart.totalItems} produk)
            </p>
            <p className="font-serif text-lg font-bold text-harvest-moss">
              {rupiah(total)}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-harvest-gold text-harvest-soil hover:bg-harvest-amber"
            onClick={placeOrder}
            disabled={submitting}
            data-testid="mobile-place-order-btn"
          >
            {submitting ? "Memproses…" : "Buat Pesanan"}
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}

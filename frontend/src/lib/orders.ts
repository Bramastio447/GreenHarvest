import { PRODUCTS, type Product } from "@/lib/products";

export type OrderStatus =
  | "menunggu_pembayaran"
  | "diproses_petani"
  | "dikirim"
  | "selesai"
  | "dibatalkan";

export interface OrderItemSnap {
  productId: string;
  qty: number;
  priceSnap: number;
}

export interface Order {
  id: string;
  createdAt: string; // ISO date
  status: OrderStatus;
  farmerName: string;
  farmerLocation: string;
  items: OrderItemSnap[];
  shippingMethod: "Reguler" | "Same Day" | "Pickup";
  shippingFee: number;
  serviceFee: number;
  paymentMethod: string;
  paymentDueAt?: string; // ISO date, for menunggu_pembayaran
  trackingNumber?: string;
  estimateArrival?: string;
  cancelReason?: string;
}

export interface OrderLine extends OrderItemSnap {
  product: Product;
  subtotal: number;
}

export interface HydratedOrder extends Order {
  lines: OrderLine[];
  subtotal: number;
  total: number;
}

export const STATUS_META: Record<
  OrderStatus,
  { label: string; tint: string; dot: string }
> = {
  menunggu_pembayaran: {
    label: "Menunggu Pembayaran",
    tint: "bg-amber-100 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
  },
  diproses_petani: {
    label: "Diproses Petani",
    tint: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
  },
  dikirim: {
    label: "Dikirim",
    tint: "bg-violet-100 text-violet-800 border-violet-300",
    dot: "bg-violet-500",
  },
  selesai: {
    label: "Selesai",
    tint: "bg-emerald-100 text-emerald-800 border-emerald-300",
    dot: "bg-emerald-500",
  },
  dibatalkan: {
    label: "Dibatalkan",
    tint: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-500",
  },
};

// Dummy orders showcasing all 5 statuses
export const ORDERS: Order[] = [
  {
    id: "GH-2026000812",
    createdAt: "2026-01-18T09:24:00Z",
    status: "menunggu_pembayaran",
    farmerName: "Tani Makmur",
    farmerLocation: "Bandung",
    items: [
      { productId: "p01", qty: 2, priceSnap: 18000 },
      { productId: "p17", qty: 1, priceSnap: 16000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer BCA",
    paymentDueAt: "2026-01-19T09:24:00Z",
  },
  {
    id: "GH-2026000805",
    createdAt: "2026-01-17T13:02:00Z",
    status: "diproses_petani",
    farmerName: "Sawah Cianjur",
    farmerLocation: "Cianjur",
    items: [
      { productId: "p03", qty: 1, priceSnap: 68000 },
      { productId: "p18", qty: 1, priceSnap: 75000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "QRIS",
  },
  {
    id: "GH-2026000791",
    createdAt: "2026-01-15T18:45:00Z",
    status: "dikirim",
    farmerName: "Tani Wonosobo",
    farmerLocation: "Wonosobo",
    items: [
      { productId: "p10", qty: 3, priceSnap: 35000 },
      { productId: "p19", qty: 2, priceSnap: 28000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "GoPay",
    trackingNumber: "JNE-948372615",
    estimateArrival: "2026-01-19",
  },
  {
    id: "GH-2026000780",
    createdAt: "2026-01-14T08:11:00Z",
    status: "dikirim",
    farmerName: "Kebun Probolinggo",
    farmerLocation: "Probolinggo",
    items: [{ productId: "p02", qty: 2, priceSnap: 32000 }],
    shippingMethod: "Same Day",
    shippingFee: 25000,
    serviceFee: 2500,
    paymentMethod: "OVO",
    trackingNumber: "GOSEND-37182990",
    estimateArrival: "2026-01-15",
  },
  {
    id: "GH-2026000762",
    createdAt: "2026-01-11T15:30:00Z",
    status: "selesai",
    farmerName: "Hijau Lestari",
    farmerLocation: "Lembang",
    items: [
      { productId: "p05", qty: 4, priceSnap: 9000 },
      { productId: "p08", qty: 2, priceSnap: 12000 },
      { productId: "p22", qty: 1, priceSnap: 14000 },
    ],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer Mandiri",
  },
  {
    id: "GH-2026000758",
    createdAt: "2026-01-10T11:18:00Z",
    status: "selesai",
    farmerName: "Petani Gayo",
    farmerLocation: "Aceh",
    items: [{ productId: "p12", qty: 2, priceSnap: 78000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Dana",
  },
  {
    id: "GH-2026000749",
    createdAt: "2026-01-08T14:00:00Z",
    status: "selesai",
    farmerName: "Madu Sumbawa",
    farmerLocation: "Sumbawa",
    items: [{ productId: "p11", qty: 1, priceSnap: 95000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "COD",
  },
  {
    id: "GH-2026000731",
    createdAt: "2026-01-05T09:50:00Z",
    status: "dibatalkan",
    farmerName: "Tani Garut",
    farmerLocation: "Garut",
    items: [{ productId: "p04", qty: 1, priceSnap: 22000 }],
    shippingMethod: "Reguler",
    shippingFee: 15000,
    serviceFee: 2500,
    paymentMethod: "Transfer BNI",
    cancelReason: "Pembeli tidak menyelesaikan pembayaran dalam 24 jam",
  },
];

export function hydrate(order: Order): HydratedOrder {
  const lines: OrderLine[] = order.items
    .map((it) => {
      const product = PRODUCTS.find((p) => p.id === it.productId);
      if (!product) return null;
      return {
        ...it,
        product,
        subtotal: it.priceSnap * it.qty,
      };
    })
    .filter((x): x is OrderLine => x !== null);
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  const total = subtotal + order.shippingFee + order.serviceFee;
  return { ...order, lines, subtotal, total };
}

export function getOrders(): HydratedOrder[] {
  return ORDERS.map(hydrate);
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

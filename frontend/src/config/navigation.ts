export const NAV_LINKS = [
  { href: "/kategori/sayuran", label: "Sayuran" },
  { href: "/kategori/buah-buahan", label: "Buah" },
  { href: "/kategori/beras", label: "Beras" },
  { href: "/kategori/rempah", label: "Rempah" },
  { href: "/kategori/bibit-tanaman", label: "Bibit" },
  { href: "/kategori/pupuk", label: "Pupuk" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/dashboard/orders", label: "Pesanan", icon: "ShoppingBag" },
  { href: "/dashboard/products", label: "Produk", icon: "Package" },
  { href: "/dashboard/customers", label: "Pelanggan", icon: "Users" },
  { href: "/dashboard/analytics", label: "Analitik", icon: "BarChart3" },
  { href: "/dashboard/settings", label: "Pengaturan", icon: "Settings" },
] as const;

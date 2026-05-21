export const NAV_LINKS = [
  { href: "/sayuran", label: "Sayuran" },
  { href: "/buah", label: "Buah" },
  { href: "/beras", label: "Beras" },
  { href: "/rempah", label: "Rempah" },
  { href: "/bibit", label: "Bibit" },
  { href: "/pupuk", label: "Pupuk" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/dashboard/orders", label: "Pesanan", icon: "ShoppingBag" },
  { href: "/dashboard/products", label: "Produk", icon: "Package" },
  { href: "/dashboard/customers", label: "Pelanggan", icon: "Users" },
  { href: "/dashboard/analytics", label: "Analitik", icon: "BarChart3" },
  { href: "/dashboard/settings", label: "Pengaturan", icon: "Settings" },
] as const;

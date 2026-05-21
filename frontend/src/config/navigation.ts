export const NAV_LINKS = [
  { href: "/market", label: "Market" },
  { href: "/growers", label: "Growers" },
  { href: "/seasons", label: "Seasons" },
  { href: "/journal", label: "Journal" },
] as const;

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/orders", label: "Orders", icon: "ShoppingBag" },
  { href: "/dashboard/products", label: "Products", icon: "Package" },
  { href: "/dashboard/customers", label: "Customers", icon: "Users" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;

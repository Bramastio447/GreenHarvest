"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DASHBOARD_NAV } from "@/config/navigation";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
};

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      data-testid="dashboard-sidebar"
      className="flex h-full flex-col gap-2 border-r border-border/60 bg-card px-4 py-6"
    >
      <div className="px-2">
        <Logo />
      </div>

      <Separator className="my-4" />

      <nav className="flex-1 space-y-1" aria-label="Dashboard">
        {DASHBOARD_NAV.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`sidebar-link-${item.label.toLowerCase()}`}
              className={cn(
                "group flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-harvest-moss text-harvest-cream"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-2" />

      <div className="px-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          data-testid="sidebar-logout-btn"
        >
          <Link href="/login">
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </Button>
      </div>
    </aside>
  );
}

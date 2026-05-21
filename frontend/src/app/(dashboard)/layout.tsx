import { Bell, Search } from "lucide-react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="dashboard-shell"
      className="grid min-h-screen w-full md:grid-cols-[260px_1fr]"
    >
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      <div className="flex min-h-screen flex-col">
        {/* Topbar */}
        <header
          data-testid="dashboard-topbar"
          className="flex h-16 items-center justify-between border-b border-border/60 bg-background px-6"
        >
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, orders, growers…"
              className="pl-9"
              data-testid="dashboard-search-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              data-testid="dashboard-notifications-btn"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div
              className="grid h-9 w-9 place-items-center rounded-full bg-harvest-moss text-sm font-semibold text-harvest-cream"
              data-testid="dashboard-avatar"
            >
              R
            </div>
          </div>
        </header>

        <main className="flex-1 bg-background px-6 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

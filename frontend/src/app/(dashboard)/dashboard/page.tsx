import type { Metadata } from "next";
import { TrendingUp, Package, ShoppingBag, Users } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

const STATS = [
  { label: "Revenue this week", value: "$4,820", delta: "+12%", icon: TrendingUp },
  { label: "Open orders", value: "38", delta: "+4", icon: ShoppingBag },
  { label: "Active products", value: "126", delta: "+8", icon: Package },
  { label: "New customers", value: "21", delta: "+3", icon: Users },
];

export default function DashboardOverviewPage() {
  return (
    <div data-testid="dashboard-overview" className="space-y-10">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-ember">
          Overview
        </p>
        <h1
          data-testid="dashboard-heading"
          className="font-serif text-4xl leading-tight tracking-tight"
        >
          Good morning, Rosa.
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s how Briar Field is doing this week.
        </p>
      </header>

      <section
        data-testid="dashboard-stats"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {STATS.map((stat) => (
          <Card
            key={stat.label}
            data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase tracking-[0.14em]">
                  {stat.label}
                </CardDescription>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="font-serif text-3xl">{stat.value}</p>
                <span className="text-xs font-medium text-harvest-moss">
                  {stat.delta}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>
              A placeholder for your order feed — wire this to Prisma once auth
              is live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-sm border border-dashed border-border bg-secondary/40 p-10 text-center text-sm text-muted-foreground">
              No orders to display yet.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>Modules planned for the next sprint.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {["Inventory sync", "Payouts", "Grower invites", "Tax reports"].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between rounded-sm bg-secondary/40 px-3 py-2"
                  >
                    <span>{item}</span>
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Soon
                    </span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

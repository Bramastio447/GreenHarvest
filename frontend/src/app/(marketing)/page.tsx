import Link from "next/link";
import { ArrowRight, Sprout, Truck, HeartHandshake, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Sprout,
    title: "Grown nearby",
    body: "Small farms within 100 miles. Picked at peak, never warehoused for weeks.",
  },
  {
    icon: Truck,
    title: "Delivered weekly",
    body: "Choose your day. We coordinate routes so produce arrives within 24h of harvest.",
  },
  {
    icon: HeartHandshake,
    title: "Fair to growers",
    body: "Growers set their own prices. We take a flat 8% — no hidden cuts, no slotting fees.",
  },
  {
    icon: Sun,
    title: "Seasonal first",
    body: "What's ripe right now, not what's been gassed in a container. Eat with the calendar.",
  },
];

const SEASONS = [
  { name: "Heirloom tomatoes", farm: "Briar Field", price: "$6.40 / lb" },
  { name: "Sungold cherries", farm: "Hollow Creek", price: "$5.20 / pint" },
  { name: "Padron peppers", farm: "Saltwater Acres", price: "$8.00 / lb" },
  { name: "White peaches", farm: "Old Mill Orchard", price: "$4.80 / lb" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative overflow-hidden border-b border-border/60 grain"
      >
        <div className="container relative grid items-center gap-16 py-20 md:grid-cols-12 md:py-28 lg:py-32">
          <div className="md:col-span-7 animate-fade-up">
            <span
              data-testid="hero-eyebrow"
              className="inline-flex items-center gap-2 rounded-full border border-harvest-moss/30 bg-harvest-moss/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-harvest-moss"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-harvest-moss" />
              Week 32 · Late summer
            </span>
            <h1
              data-testid="hero-title"
              className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl"
            >
              The market
              <br />
              <span className="italic text-harvest-moss">your grandmother</span>
              <br />
              would recognize.
            </h1>
            <p
              data-testid="hero-description"
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Green Harvest is a cooperative marketplace for produce that hasn&apos;t
              been on a truck for a week. Find what&apos;s ripe today, from the
              people who grew it, delivered to your door tomorrow.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" data-testid="hero-cta-primary">
                <Link href="/market">
                  Shop the market
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                data-testid="hero-cta-secondary"
              >
                <Link href="/growers">Meet the growers</Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-harvest-leaf/30 blur-3xl" />
              <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-harvest-ember/20 blur-3xl" />
              <div className="relative rounded-md border border-border/60 bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    This week&apos;s harvest
                  </p>
                  <Link
                    href="/seasons"
                    className="text-xs font-medium text-harvest-moss underline-offset-4 hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <ul className="divide-y divide-border/60">
                  {SEASONS.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.farm}
                        </p>
                      </div>
                      <span className="font-serif text-lg">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        data-testid="features-section"
        className="border-b border-border/60 bg-card"
      >
        <div className="container py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-ember">
                How it works
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                A short trip
                <br />
                from soil to supper.
              </h2>
            </div>
            <div className="grid gap-x-10 gap-y-12 md:col-span-8 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  data-testid={`feature-${feature.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group"
                >
                  <feature.icon
                    className="h-7 w-7 text-harvest-moss transition-transform group-hover:-rotate-6"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-4 font-serif text-2xl tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-testid="cta-section" className="bg-harvest-soil text-harvest-cream">
        <div className="container py-20 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Eat the season.
                <br />
                <span className="italic text-harvest-leaf">Support the farm.</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-harvest-cream/70">
                Sign up for a weekly basket and we&apos;ll curate the best of what
                each grower brings in. Cancel any week. Skip with one tap.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
              <Button
                asChild
                size="lg"
                variant="accent"
                data-testid="cta-primary-btn"
              >
                <Link href="/register">
                  Start a basket
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/about"
                className="text-sm text-harvest-cream/70 underline-offset-4 hover:text-harvest-cream hover:underline"
              >
                Or read our cooperative manifesto →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

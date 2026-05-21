import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-ember">
        404 · Off the beaten path
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-tight tracking-tight">
        Nothing growing here.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for has wilted or never existed. Let&apos;s
        get you back to the market.
      </p>
      <Button asChild className="mt-8" data-testid="notfound-home-btn">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}

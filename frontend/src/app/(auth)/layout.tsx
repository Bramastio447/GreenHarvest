import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Visual side */}
      <aside
        data-testid="auth-visual-pane"
        className="relative hidden flex-col justify-between bg-harvest-moss px-10 py-10 text-harvest-cream md:flex"
      >
        <Logo variant="inverted" />
        <div>
          <p className="font-serif text-3xl leading-snug tracking-tight">
            &ldquo;The shortest distance between a tomato and a table is a
            neighbour you trust.&rdquo;
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-harvest-cream/70">
            — Rosa, Briar Field Farm
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-harvest-cream/60">
          <span className="h-1.5 w-1.5 rounded-full bg-harvest-cream/60" />
          A cooperative of 142 growers in 6 counties.
        </div>
      </aside>

      {/* Form side */}
      <main className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 md:hidden">
          <Logo />
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
            data-testid="auth-back-to-home"
          >
            ← Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  showWordmark?: boolean;
  variant?: "default" | "inverted";
}

export function Logo({
  className,
  href = "/",
  showWordmark = true,
  variant = "default",
}: LogoProps) {
  const inverted = variant === "inverted";
  return (
    <Link
      href={href}
      data-testid="brand-logo-link"
      className={cn(
        "group inline-flex items-center gap-2 transition-opacity hover:opacity-80",
        inverted ? "text-harvest-cream" : "text-foreground",
        className
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-sm",
          inverted
            ? "bg-harvest-cream text-harvest-moss"
            : "bg-harvest-moss text-harvest-cream"
        )}
      >
        <Leaf className="h-4 w-4" strokeWidth={2.25} />
      </span>
      {showWordmark && (
        <span className="font-serif text-lg font-semibold tracking-tight">
          Green
          <span
            className={cn(
              "italic",
              inverted ? "text-harvest-leaf" : "text-harvest-moss"
            )}
          >
            {" "}
            Harvest
          </span>
        </span>
      )}
    </Link>
  );
}

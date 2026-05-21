"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { NAV_LINKS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      data-testid="site-navbar"
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 md:flex"
            data-testid="primary-nav"
          >
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                  className={cn(
                    "relative text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-[22px] left-0 h-[2px] w-full bg-harvest-moss" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            data-testid="navbar-basket-btn"
          >
            <Link href="/cart" aria-label="Basket">
              <ShoppingBasket className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
            data-testid="navbar-login-btn"
          >
            <Link href="/login">Sign in</Link>
          </Button>

          <Button
            asChild
            variant="default"
            size="sm"
            className="hidden md:inline-flex"
            data-testid="navbar-register-btn"
          >
            <Link href="/register">Join the harvest</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                data-testid="mobile-menu-trigger"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-2 mb-8">
                <Logo />
              </div>
              <nav
                className="flex flex-col gap-1"
                data-testid="mobile-nav"
                aria-label="Mobile"
              >
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                      className={cn(
                        "rounded-sm px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                        pathname === link.href && "bg-secondary text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2">
                <SheetClose asChild>
                  <Button asChild variant="outline" data-testid="mobile-login-btn">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild data-testid="mobile-register-btn">
                    <Link href="/register">Join the harvest</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

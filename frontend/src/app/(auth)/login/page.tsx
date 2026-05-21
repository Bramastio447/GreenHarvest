import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div data-testid="login-page" className="animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-ember">
        Welcome back
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight">
        Sign in to your harvest.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-harvest-moss underline-offset-4 hover:underline"
          data-testid="login-to-register-link"
        >
          Create one
        </Link>
        .
      </p>

      <form className="mt-8 space-y-5" data-testid="login-form">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@harvest.co"
            autoComplete="email"
            data-testid="login-email-input"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              data-testid="login-forgot-link"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            data-testid="login-password-input"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          data-testid="login-submit-btn"
        >
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        data-testid="login-google-btn"
      >
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing in you agree to our{" "}
        <Link href="/terms" className="underline-offset-4 hover:underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div data-testid="register-page" className="animate-fade-up">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-harvest-ember">
        Join the harvest
      </p>
      <h1 className="mt-2 font-serif text-4xl leading-tight tracking-tight">
        Make your basket.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Already a member?{" "}
        <Link
          href="/login"
          className="font-medium text-harvest-moss underline-offset-4 hover:underline"
          data-testid="register-to-login-link"
        >
          Sign in
        </Link>
        .
      </p>

      <form className="mt-8 space-y-5" data-testid="register-form">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Rosa Martinez"
            autoComplete="name"
            data-testid="register-name-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@harvest.co"
            autoComplete="email"
            data-testid="register-email-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            data-testid="register-password-input"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          data-testid="register-submit-btn"
        >
          Create account
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
        data-testid="register-google-btn"
      >
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline-offset-4 hover:underline">
          terms
        </Link>
        .
      </p>
    </div>
  );
}

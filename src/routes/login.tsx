import { createFileRoute, Link } from "@tanstack/react-router";
import { authEnabled, signIn } from "@/lib/auth/client";
import { BrandLogo } from "@/components/brand-logo";
import { GoogleMark } from "@/components/google-mark";
import { KeyButton, KeyLink } from "@/components/key-button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6">
      <div className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-6">
        <Link to="/" className="flex justify-center">
          <BrandLogo className="h-16 w-auto max-w-[280px] object-contain" />
        </Link>
        <h1 className="text-center font-display text-xl font-semibold">
          Sign in
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Google is optional. Use it to save your name and email, or carry on
          as a guest to shop and pay.
        </p>
        {authEnabled ? (
          <KeyButton
            onClick={() => signIn("grok-google", { callbackURL: "/" })}
          >
            <GoogleMark className="size-5" />
            Continue with Google
          </KeyButton>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Sign-in is disabled.
          </p>
        )}
        <KeyLink to="/" size="default">Continue as guest</KeyLink>
      </div>
    </main>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6">
        <div className="w-full rounded-xl bg-card p-4">
          <img
            src="/payment-methods.png"
            alt="Accepted payment methods: Amex, Apple Pay, Diners Club, Discover, Google Pay, JCB, Mastercard, PayPal and Visa"
            className="mx-auto h-auto w-full max-w-2xl"
          />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 LootersRetail. Prices in NZD, GST inclusive. Contact:{" "}
          <a
            href="mailto:LootersRetail@protonmail.com"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            LootersRetail@protonmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

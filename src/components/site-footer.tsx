import { ARTWORK } from "@/lib/artwork";
import { ShopSearch } from "@/components/shop-search";
import { SITE_DOMAIN, SITE_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6">
        <ShopSearch className="w-full max-w-md" />
        <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-5 sm:gap-6 sm:p-6">
          <img
            src={ARTWORK.afterpay}
            alt="Afterpay: Shop now. Pay later. Always interest-free. Split your purchase into 4 payments, payable every 2 weeks."
            width={600}
            height={600}
            className="mx-auto h-auto w-full max-w-md"
          />
          <img
            src={ARTWORK.payments}
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
        <a
          href={SITE_URL}
          className="text-[11px] font-medium tracking-wide text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {SITE_DOMAIN}
        </a>
      </div>
    </footer>
  );
}

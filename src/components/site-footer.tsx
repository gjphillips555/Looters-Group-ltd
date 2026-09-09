import { ARTWORK } from "@/lib/artwork";
import { AccountButton } from "@/components/account-button";
import { BrandLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE_DOMAIN, SITE_URL } from "@/lib/site";

export function SiteFooter({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <footer className="mt-16 bg-white text-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:px-6">
        <BrandLogo className="h-16 w-auto max-w-[280px] object-contain sm:h-20 sm:max-w-[340px]" />
        <ShopSearch
          className="w-full max-w-lg"
          placeholder="Search Products"
          inputClassName="h-11 border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 focus-visible:border-neutral-500 focus-visible:ring-neutral-400/40"
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AccountButton />
          <CartButton onClick={onOpenCart} />
        </div>
        <img
          src={ARTWORK.afterpay}
          alt="Afterpay: Shop now. Pay later. Always interest-free. Split your purchase into 4 payments, payable every 2 weeks."
          width={600}
          height={600}
          className="mx-auto h-auto w-full max-w-3xl"
        />
        <img
          src={ARTWORK.payments}
          alt="Accepted payment methods: Amex, Apple Pay, Diners Club, Discover, Google Pay, JCB, Mastercard, PayPal and Visa"
          className="mx-auto h-auto w-full max-w-3xl"
        />
        <p className="text-center text-xs text-neutral-600">
          &copy; 2026 LootersRetail. Prices in NZD, GST inclusive. Contact:{" "}
          <a
            href="mailto:LootersRetail@protonmail.com"
            className="font-medium text-neutral-900 underline-offset-2 hover:underline"
          >
            LootersRetail@protonmail.com
          </a>
        </p>
        <a
          href={SITE_URL}
          className="text-[11px] font-medium tracking-wide text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
        >
          {SITE_DOMAIN}
        </a>
      </div>
    </footer>
  );
}

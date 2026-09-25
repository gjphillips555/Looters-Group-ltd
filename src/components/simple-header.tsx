import { Link } from "@tanstack/react-router";
import { AccountButton } from "@/components/account-button";
import { BrandLogo } from "@/components/brand-logo";
import { CartButton } from "@/components/cart-button";
import { ShopSearch } from "@/components/shop-search";
import { ThemeToggle } from "@/components/theme-toggle";

export function SimpleHeader({
  onOpenCart,
  onFish,
}: {
  onOpenCart: () => void;
  onFish: () => void;
}) {
  return (
    <header className="sticky top-0 z-30">
      <div className="header-key header-key-solid">
        <div className="header-key-cap header-key-cap-solid">
          <div className="relative mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
            <Link to="/" className="flex shrink-0 flex-col items-center" aria-label="Looters Computas home">
              <BrandLogo className="h-12 w-auto max-w-[210px] object-contain sm:h-14 sm:max-w-[250px]" />
            </Link>

            <ShopSearch className="hidden min-w-0 md:flex md:w-[200px] lg:w-[260px]" showButton={false} />

            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <ThemeToggle />
              <AccountButton />
              <CartButton onClick={onOpenCart} />
              <button
                type="button"
                className="kb-key kb-key-sm kb-teal"
                onClick={onFish}
                aria-label="Switch to Attack Shark keyboard"
                title="Attack Shark keyboard"
              >
                <span className="kb-cap">
                  <span className="kb-dual">
                    <b>Atk . .</b>
                    <i>Shark</i>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

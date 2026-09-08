import { useState, type ReactNode } from "react";
import { BrandTicker } from "@/components/brand-ticker";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AppShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <SiteHeader onOpenCart={() => setCartOpen(true)} />
      <BrandTicker />
      <main className="shell-main mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {children}
      </main>
      <SiteFooter onOpenCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

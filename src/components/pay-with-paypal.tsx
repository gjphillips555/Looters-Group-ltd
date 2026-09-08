import { nzd } from "@/lib/products";
import { submitPayPalCheckout } from "@/lib/paypal";
import type { Customer } from "@/lib/orders";

export function PayPalMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#003087"
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.648h8.09c2.66 0 4.526.73 5.385 2.11.76 1.22.79 2.75.09 4.4-.03.08-.07.16-.1.24-.9 2.37-2.91 3.6-5.77 3.6H10.4c-.55 0-1.02.4-1.11.94l-.9 5.71c-.06.38-.39.66-.77.66h-.444z"
      />
      <path
        fill="#0070E0"
        d="M19.255 7.68c-.02.1-.04.2-.07.31-.97 2.55-3.14 3.87-6.22 3.87h-2.99c-.55 0-1.02.4-1.11.94l-1.04 6.59-.3 1.89c-.06.38.23.72.62.72h4.32c.54 0 1-.39 1.08-.92l.04-.23.85-5.39.06-.31c.08-.53.54-.92 1.08-.92h.68c4.4 0 7.84-1.79 8.85-6.96.42-2.16.2-3.96-.9-5.23-.32-.37-.7-.68-1.13-.94.7 1.98.4 4.02-.72 6.59z"
      />
    </svg>
  );
}

export function PayWithPaypal({
  orderId,
  amount,
  disabled,
  customer,
  itemName,
  cancelPath = "/checkout",
  onBeforePay,
}: {
  orderId: string;
  amount: number;
  disabled?: boolean;
  customer?: Customer;
  itemName?: string;
  cancelPath?: string;
  onBeforePay?: () => boolean | void | Promise<boolean | void>;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        void (async () => {
          if (onBeforePay) {
            const ok = await onBeforePay();
            if (ok === false) return;
          }
          const origin = window.location.origin;
          submitPayPalCheckout({
            orderId,
            amount,
            itemName,
            customer,
            returnUrl: `${origin}/order/${orderId}?paid=1`,
            cancelUrl: `${origin}${cancelPath}`,
          });
        })();
      }}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-paypal px-4 text-sm font-semibold text-paypal-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <PayPalMark className="size-6" />
      Pay with PayPal · {nzd(amount)}
    </button>
  );
}

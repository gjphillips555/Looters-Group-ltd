import { KeyButton } from "@/components/key-button";
import { startCardPay } from "@/lib/airwallex";
import { nzd } from "@/lib/products";

export function PayWithCard({
  orderId,
  amount,
  title,
  disabled,
  onBeforePay,
  onError,
}: {
  orderId: string;
  amount: number;
  title: string;
  disabled?: boolean;
  onBeforePay?: () => boolean | void | Promise<boolean | void>;
  onError?: (message: string) => void;
}) {
  return (
    <KeyButton
      type="button"
      tone="teal"
      className="kb-spacebar w-full"
      disabled={disabled}
      onClick={() => {
        void (async () => {
          if (onBeforePay) {
            const ok = await onBeforePay();
            if (ok === false) return;
          }
          try {
            const { url } = await startCardPay({ data: { orderId, amount, title } });
            window.location.assign(url);
          } catch (err) {
            onError?.(err instanceof Error ? err.message : "Card payment did not start");
          }
        })();
      }}
    >
      Pay by card · {nzd(amount)}
    </KeyButton>
  );
}

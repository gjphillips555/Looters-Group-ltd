/** Round up to the next price ending in 4.99 or 9.99. Never rounds down. */
export function charmUp(amount: number) {
  const cents = Math.ceil(amount * 100 - 1e-6);
  const base = Math.floor(cents / 1000) * 1000;
  for (const tail of [499, 999, 1499]) {
    if (base + tail >= cents) return (base + tail) / 100;
  }
  return (base + 1499) / 100;
}

/**
 * Lowest price that still leaves `profit` after PayPal.
 * NZ domestic receive rate, May 2026: 3.40% + $0.45.
 */
export function clearCost(cost: number, profit = 0) {
  const ask = (cost + profit + 0.45) / 0.966;
  return Math.ceil(ask * 100 - 1e-6) / 100;
}

/** Shop shelf: $1 clear of cost and PayPal, then charm-rounded up. Never rounds down. */
export function markedUp(cost: number) {
  return charmUp(clearCost(cost, 1));
}

/**
 * Nearest $x4.99 or $x9.99 strictly below a PB Tech (inc GST) price.
 * $149 → $144.99, $119 → $114.99, $99.99 → $94.99.
 */
export function justUnderPb(pb: number) {
  if (!(pb > 0)) return 0;
  const cents = Math.floor(pb * 100 - 1);
  let block = Math.floor(cents / 1000) * 1000;
  for (let step = 0; step < 6; step += 1) {
    for (const tail of [999, 499]) {
      const candidate = block + tail;
      if (candidate <= cents && candidate > 0) return candidate / 100;
    }
    block -= 1000;
  }
  return Math.max(0.99, cents / 100);
}

/** If a just-under-PB price would not clear the landed cost, use the $1 shelf instead. */
export function aliExpressPrice(landed: number, pb: number) {
  const ask = justUnderPb(pb);
  if (!(landed > 0) || ask > landed) return ask;
  return markedUp(landed);
}

/** Round up to the next price ending in 4.99 or 9.99. Never rounds down. */
export function charmUp(amount: number) {
  const cents = Math.ceil(amount * 100 - 1e-6);
  const base = Math.floor(cents / 1000) * 1000;
  for (const tail of [499, 999, 1499]) {
    if (base + tail >= cents) return (base + tail) / 100;
  }
  return (base + 1499) / 100;
}

/** Shelf price plus 7%, then charm-rounded up. */
export function markedUp(cost: number) {
  return charmUp(Math.round(cost * 107) / 100);
}

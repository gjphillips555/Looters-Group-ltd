# LootersDarkMode

Dark-mode shopfront for **LootersRetail** — live TradeMe listings with cart and checkout, built for NZ buyers.

Part of the [Looters Group](https://github.com/gjphillips555/Looters-Group-ltd) umbrella (Computas · Apparel · Software).

## What it does

- Pulls **live listings** from the LootersRetail TradeMe account (member `9233545`)
- Browse a product grid, open listing detail pages
- Add **Buy Now** items to a cart (quantity + shipping options from TradeMe)
- Checkout with NZ delivery details; shipping matched to North/South Island
- Order summary with GST note; place order and view confirmation
- Fully dark UI (purple/violet palette, easy on the eyes)

Sales still settle on TradeMe (Ping / Afterpay). This site is the shopfront and order sheet.

## Stack

- React 19 + TanStack Start / Router / Query
- Tailwind CSS v4 (dark theme tokens)
- Zustand cart store
- TradeMe public/search API (optional OAuth consumer keys for higher limits)

## Local development

```bash
npm install
npm run dev
```

App listens on `http://0.0.0.0:8080`.

### Optional TradeMe credentials

Set these for authenticated API access (higher rate limits / reliability):

- `TRADEME_CONSUMER_KEY`
- `TRADEME_CONSUMER_SECRET`

Without them the app still works against the public endpoints where available.

Auth and database are **off** by default (cart/orders use client-side storage for the demo flow).

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run preview` | Preview production build |

## Related repos

| Repo | Role |
|------|------|
| [Looters-Group-ltd](https://github.com/gjphillips555/Looters-Group-ltd) | Umbrella site |
| [LootersRetail](https://github.com/gjphillips555/LootersRetail) | Retail-related work |
| [looters-stores](https://github.com/gjphillips555/looters-stores) | Computas / Apparel / Software stores |
| [SiftaBrowser](https://github.com/gjphillips555/SiftaBrowser) | Sifta Browser |

## License

Private project for Looters Group Ltd. All rights reserved unless otherwise noted.

# Looters Group — one project

This chat and this repo are the home for the whole thing.
Other Grok chats cannot be imported (those URLs are private). The GitHub
repos below are the source of truth for anything built in those chats.

## Live

| What | URL |
|---|---|
| Looters Group (this site) | https://looters-group-ltd.vercel.app |
| Sifta Browser (web) | https://siftabrowser-looters-group.vercel.app |
| Old Computas storefront | https://lootzy-storefront.onrender.com |
| Sifta desktop downloads | https://github.com/gjphillips555/Sifta-WebApp/releases/latest |

## GitHub (`gjphillips555`)

| Repo | What it is |
|---|---|
| [Looters-Group-ltd](https://github.com/gjphillips555/Looters-Group-ltd) | Umbrella site — Computas, Apparel, Software. **Keep building here.** |
| [SiftaBrowser](https://github.com/gjphillips555/SiftaBrowser) | Sifta web app: browser chrome, VPN, TV, IKWIK, slots (Kung Fu Clown, Stolen Cars, Totara Park Roundabout), poker, SiftaLoot |
| [Sifta-WebApp](https://github.com/gjphillips555/Sifta-WebApp) | Windows 11 + Linux x64 desktop builds |
| [lootzy-storefront](https://github.com/gjphillips555/lootzy-storefront) | Original Tradevine / Trade Me Python store |

## How the pieces fit

```
Looters Group Ltd  (a Purple Penguin company)
├── Computas     refurbished PCs  — Tradevine DSKTP / LPTOP / CMPNT
├── Apparel      second-life + originals — Tradevine APARL only
└── Software
    ├── Sifta Browser (web + desktop)
    ├── Overlay tool
    └── SiftaLoot wallet (works on this site without the browser)
```

Sales stay on Trade Me. This site is the shopfront.

## Sign-in on the live site

Needs Neon `DATABASE_URL` + GitHub/Google/X OAuth apps on Vercel.
Wizard: `setup-signin.bat` in this repo.

## Keep working in THIS chat

Do not start a new Grok Build app for Sifta or Computas.
If a change belongs in SiftaBrowser or Sifta-WebApp, say so and we
edit that repo from here via GitHub.

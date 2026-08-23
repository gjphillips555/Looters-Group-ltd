# Looters Group

Umbrella for Computas, Apparel, and Software (Sifta Browser).

**This repo + this Grok chat are the home for the whole project.**
See [PROJECT.md](PROJECT.md) for every related site and GitHub repo.

Live: [looters-group-ltd.vercel.app](https://looters-group-ltd.vercel.app/)

Sales stay on [Trade Me](https://www.trademe.co.nz).

## Sign-in

Windows: double-click `setup-signin.bat` (opens Neon, GitHub OAuth, Vercel).

Needs `DATABASE_URL` (Neon) plus GitHub/Google/X app keys on Vercel.
Callbacks:

- GitHub `https://looters-group-ltd.vercel.app/api/auth/callback/github`
- Google `https://looters-group-ltd.vercel.app/api/auth/callback/google`
- X `https://looters-group-ltd.vercel.app/api/auth/callback/twitter`

Also: `BETTER_AUTH_URL=https://looters-group-ltd.vercel.app`

## Tradevine

`TRADEVINE_CONSUMER_KEY` `TRADEVINE_CONSUMER_SECRET`
`TRADEVINE_ACCESS_TOKEN` `TRADEVINE_ACCESS_TOKEN_SECRET`

APARL → Apparel only. DSKTP / LPTOP / CMPNT → Computas.

Staff: `/staff` — pin `Staff` / `Staff`.

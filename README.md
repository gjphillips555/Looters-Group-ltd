# Looters Group

Umbrella site for Looters Computas, Looters Apparel, and Looters Software.

Live: [looters-group-ltd.vercel.app](https://looters-group-ltd.vercel.app/)

Sales stay on [Trade Me](https://www.trademe.co.nz).

## Sign-in (Google / X / GitHub)

The live Vercel site cannot use the Grok preview login. Add these on
**Vercel → looters-group-ltd → Settings → Environment Variables**, then **Redeploy**.

### 1. Database (required)

1. [neon.tech](https://neon.tech) — sign in with GitHub, create a project.
2. Copy the connection string.
3. Vercel env: `DATABASE_URL`

### 2. GitHub (easiest)

1. [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → New.
2. Homepage: `https://looters-group-ltd.vercel.app`
3. Callback: `https://looters-group-ltd.vercel.app/api/auth/callback/github`
4. Vercel env: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

### 3. Google

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth client → Web.
2. Authorized redirect: `https://looters-group-ltd.vercel.app/api/auth/callback/google`
3. Vercel env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 4. X

1. [developer.x.com](https://developer.x.com) → app → User authentication.
2. Callback: `https://looters-group-ltd.vercel.app/api/auth/callback/twitter`
3. Vercel env: `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`

Also set `BETTER_AUTH_URL=https://looters-group-ltd.vercel.app` and a random
`BETTER_AUTH_SECRET`.

## Tradevine labels

`TRADEVINE_CONSUMER_KEY`, `TRADEVINE_CONSUMER_SECRET`,
`TRADEVINE_ACCESS_TOKEN`, `TRADEVINE_ACCESS_TOKEN_SECRET`

APARL listings only appear on Apparel. DSKTP / LPTOP / CMPNT stay on Computas.

Staff desk: `/staff` — owner pin `Staff` / `Staff`.

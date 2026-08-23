/** Production (Vercel) origin helpers — used by the Better Auth server config. */

function trim(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function asOrigin(host: string | undefined): string | undefined {
  if (!host) return undefined;
  return host.startsWith("http") ? host.replace(/\/$/, "") : `https://${host.replace(/\/$/, "")}`;
}

/** Public origin of this deploy. Vercel injects these; BETTER_AUTH_URL wins. */
export function deployedOrigin(): string | undefined {
  return (
    asOrigin(trim("BETTER_AUTH_URL")) ??
    asOrigin(trim("VERCEL_PROJECT_PRODUCTION_URL")) ??
    asOrigin(trim("VERCEL_URL"))
  );
}

export const VERCEL_TRUSTED_ORIGINS: string[] = [
  "*.vercel.app",
  "https://*.vercel.app",
  "https://looters-group-ltd.vercel.app",
];

export function socialEnv() {
  const pair = (idKey: string, secretKey: string) => {
    const clientId = trim(idKey);
    const clientSecret = trim(secretKey);
    return clientId && clientSecret ? { clientId, clientSecret } : null;
  };
  return {
    google: pair("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
    github: pair("GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"),
    twitter: pair("TWITTER_CLIENT_ID", "TWITTER_CLIENT_SECRET") ?? pair("X_CLIENT_ID", "X_CLIENT_SECRET"),
  };
}

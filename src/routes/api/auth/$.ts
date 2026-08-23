import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";

function needsDatabase(request: Request): boolean {
  if (!process.env.VERCEL) return false;
  if (process.env.DATABASE_URL?.trim()) return false;
  const path = new URL(request.url).pathname;
  return /sign-in|sign-up|callback|oauth2/i.test(path);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => {
        if (needsDatabase(request)) {
          return Response.json(
            {
              message:
                "Sign-in on the live site needs a free Neon DATABASE_URL on Vercel.",
            },
            { status: 503 },
          );
        }
        return auth.handler(request);
      },
      POST: ({ request }) => {
        if (needsDatabase(request)) {
          return Response.json(
            {
              message:
                "Sign-in on the live site needs a free Neon DATABASE_URL on Vercel.",
            },
            { status: 503 },
          );
        }
        return auth.handler(request);
      },
    },
  },
});

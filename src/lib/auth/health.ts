import { createServerFn } from "@tanstack/react-start";
import { socialEnv } from "./deploy";

export const getAuthHealth = createServerFn({ method: "GET" }).handler(async () => {
  const s = socialEnv();
  const vercel = Boolean(process.env.VERCEL);
  return {
    database: vercel ? Boolean(process.env.DATABASE_URL?.trim()) : true,
    google: vercel ? Boolean(s.google) : true,
    github: vercel ? Boolean(s.github) : true,
    x: vercel ? Boolean(s.twitter) : true,
  };
});

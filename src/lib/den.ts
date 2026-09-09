import { createServerFn } from "@tanstack/react-start";

export type DenStatus = "pending_puzzle" | "entrant" | "approved" | "rejected";

export const denSignup = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const v = (input ?? {}) as Record<string, string>;
    const username = String(v.username ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 32);
    const email = String(v.email ?? "").trim().slice(0, 160);
    const password = String(v.password ?? "");
    if (!/^[a-z0-9_]{3,32}$/.test(username)) throw new Error("Username: 3–32 letters, numbers, _");
    if (!/.+@.+\..+/.test(email)) throw new Error("Need a real email");
    if (password.length < 8) throw new Error("Password at least 8 characters");
    return { username, email, password };
  })
  .handler(async ({ data }) => {
    const core = await import("@/lib/den-core.server");
    return core.signup(data);
  });

export const denLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const v = (input ?? {}) as Record<string, string>;
    return {
      username: String(v.username ?? "").trim().toLowerCase(),
      password: String(v.password ?? ""),
    };
  })
  .handler(async ({ data }) => {
    const core = await import("@/lib/den-core.server");
    return core.login(data);
  });

export const denMe = createServerFn({ method: "GET" }).handler(async () => {
  const core = await import("@/lib/den-core.server");
  return core.me();
});

export const denSubmitPuzzle = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const v = (input ?? {}) as Record<string, string>;
    return {
      token: String(v.token ?? "").slice(0, 80),
      answer: String(v.answer ?? "").slice(0, 80),
    };
  })
  .handler(async ({ data }) => {
    const core = await import("@/lib/den-core.server");
    return core.submitPuzzle(data);
  });

export const denForum = createServerFn({ method: "GET" }).handler(async () => {
  const core = await import("@/lib/den-core.server");
  return core.forum();
});

export const denApprove = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({
    id: String((input as { id?: string })?.id ?? ""),
    allow: Boolean((input as { allow?: boolean })?.allow),
  }))
  .handler(async ({ data }) => {
    const core = await import("@/lib/den-core.server");
    return core.approve(data);
  });

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type DenStatus = "pending_puzzle" | "entrant" | "approved" | "rejected";

export type DenPublicUser = {
  id: string;
  username: string;
  email: string;
  status: DenStatus;
};

type DenRow = DenPublicUser & {
  password_hash: string | null;
  puzzle_token: string | null;
  puzzle_tries: number;
};

const COOKIE = "den_session";

function secret() {
  return (
    process.env.DEN_ADMIN_SECRET?.trim() ||
    process.env.BETTER_AUTH_SECRET?.trim() ||
    "looters-den-local"
  );
}

function puzzleAnswer() {
  return process.env.DEN_PUZZLE_ANSWER?.trim() ?? "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function packCookie(kind: "admin" | "user", id: string) {
  const body = `${kind}.${id}.${Date.now()}`;
  return `${body}.${sign(body)}`;
}

function unpackCookie(raw: string | undefined) {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 4) return null;
  const [kind, id, ts, mac] = parts;
  const body = `${kind}.${id}.${ts}`;
  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (kind !== "admin" && kind !== "user") return null;
  return { kind, id };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a.normalize("NFKC").trim().toLowerCase());
  const right = Buffer.from(b.normalize("NFKC").trim().toLowerCase());
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function newId() {
  return randomBytes(12).toString("hex");
}

async function sql() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

async function notify(text: string) {
  const hook = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    /* optional */
  }
}

function setSession(kind: "admin" | "user", id: string) {
  setCookie(COOKIE, packCookie(kind, id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function signup(data: {
  username: string;
  email: string;
  password: string;
}) {
  const db = await sql();
  const existing = await db.query<{ id: string }>(
    "select id from den_users where username = $1 or email = $2 limit 1",
    [data.username, data.email],
  );
  if (existing[0]) throw new Error("That username or email is already in the den");
  const id = newId();
  const token = newId() + newId();
  await db.query(
    `insert into den_users (id, username, email, password_hash, status, puzzle_token)
     values ($1, $2, $3, $4, 'pending_puzzle', $5)`,
    [id, data.username, data.email, hashPassword(data.password), token],
  );
  await db.query(
    `insert into den_dms (id, author, body, kind) values ($1, $2, $3, 'signup')`,
    [
      newId(),
      "system",
      `New signup: ${data.username} <${data.email}> — waiting on the letter.`,
    ],
  );
  await notify(`Looters den: new signup ${data.username} (${data.email})`);
  setSession("user", id);
  return { token };
}

export async function login(data: { username: string; password: string }) {
  const adminUser = (process.env.DEN_ADMIN_USER?.trim() || "looters").toLowerCase();
  const adminSecret = process.env.DEN_ADMIN_SECRET?.trim() || "";
  if (
    data.username === adminUser &&
    adminSecret &&
    safeEqual(data.password, adminSecret)
  ) {
    setSession("admin", "admin");
    return { role: "admin" as const, status: "approved" as DenStatus };
  }
  const db = await sql();
  const rows = await db.query<DenRow>(
    "select id, username, email, password_hash, status from den_users where username = $1 limit 1",
    [data.username],
  );
  const row = rows[0];
  if (!row?.password_hash || !checkPassword(data.password, row.password_hash)) {
    throw new Error("No.");
  }
  setSession("user", row.id);
  return { role: "user" as const, status: row.status };
}

export async function me() {
  const session = unpackCookie(getCookie(COOKIE));
  if (!session) return { role: "none" as const, user: null };
  if (session.kind === "admin") {
    return {
      role: "admin" as const,
      user: {
        id: "admin",
        username: "looters",
        email: "",
        status: "approved" as DenStatus,
      },
    };
  }
  const db = await sql();
  const rows = await db.query<DenRow>(
    "select id, username, email, status from den_users where id = $1 limit 1",
    [session.id],
  );
  const row = rows[0];
  if (!row) return { role: "none" as const, user: null };
  return {
    role: "user" as const,
    user: {
      id: row.id,
      username: row.username,
      email: row.email,
      status: row.status,
    },
  };
}

export async function submitPuzzle(data: { token: string; answer: string }) {
  const expected = puzzleAnswer();
  if (!expected) throw new Error("Den is locked. Admin hasn't set DEN_PUZZLE_ANSWER.");
  const db = await sql();
  const rows = await db.query<DenRow>(
    "select id, username, email, status, puzzle_token, puzzle_tries from den_users where puzzle_token = $1 limit 1",
    [data.token],
  );
  const row = rows[0];
  if (!row) throw new Error("This letter is void.");
  if (row.status !== "pending_puzzle") return { ok: true as const, already: true };
  if (row.puzzle_tries >= 5) throw new Error("Letter burned.");
  const ok = safeEqual(data.answer, expected);
  if (!ok) {
    await db.query("update den_users set puzzle_tries = puzzle_tries + 1 where id = $1", [
      row.id,
    ]);
    throw new Error("Wrong.");
  }
  await db.query("update den_users set status = 'entrant' where id = $1", [row.id]);
  await db.query(
    `insert into den_dms (id, author, body, kind) values ($1, $2, $3, 'entrant')`,
    [
      newId(),
      row.username,
      `${row.username} solved the letter and is waiting as an entrant. Approve?`,
    ],
  );
  await notify(`Looters den: ${row.username} is an entrant — approve in the forum.`);
  setSession("user", row.id);
  return { ok: true as const, already: false };
}

export async function forum() {
  const session = unpackCookie(getCookie(COOKIE));
  if (!session) return { role: "none" as const, dms: [], pending: [] };
  const db = await sql();
  if (session.kind === "admin") {
    const dms = await db.query<{
      id: string;
      created_at: string;
      author: string;
      body: string;
      kind: string;
    }>("select id, created_at, author, body, kind from den_dms order by created_at desc limit 40");
    const pending = await db.query<DenPublicUser>(
      "select id, username, email, status from den_users where status in ('entrant','pending_puzzle') order by created_at desc",
    );
    return { role: "admin" as const, dms, pending };
  }
  const rows = await db.query<DenRow>(
    "select id, username, email, status from den_users where id = $1 limit 1",
    [session.id],
  );
  const user = rows[0];
  if (!user) return { role: "none" as const, dms: [], pending: [] };
  if (user.status !== "approved") {
    return { role: "user" as const, status: user.status, dms: [], pending: [] };
  }
  const dms = await db.query<{
    id: string;
    created_at: string;
    author: string;
    body: string;
    kind: string;
  }>(
    "select id, created_at, author, body, kind from den_dms where kind = 'board' or author = $1 order by created_at desc limit 40",
    [user.username],
  );
  return { role: "user" as const, status: user.status, dms, pending: [] };
}

export async function approve(data: { id: string; allow: boolean }) {
  const session = unpackCookie(getCookie(COOKIE));
  if (session?.kind !== "admin") throw new Error("Nope.");
  const status = data.allow ? "approved" : "rejected";
  const db = await sql();
  const rows = await db.query<DenRow>(
    "select id, username from den_users where id = $1 limit 1",
    [data.id],
  );
  const row = rows[0];
  if (!row) throw new Error("Gone.");
  await db.query("update den_users set status = $1 where id = $2", [status, data.id]);
  await db.query(
    `insert into den_dms (id, author, body, kind) values ($1, 'looters', $2, 'board')`,
    [
      newId(),
      data.allow
        ? `${row.username} is in. Welcome to the den.`
        : `${row.username} was turned away.`,
    ],
  );
  return { ok: true };
}

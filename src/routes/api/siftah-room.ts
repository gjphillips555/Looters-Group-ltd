import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const CODE = /^[A-Z2-9]{6}$/;
const MAX_MESSAGES = 80;
const MAX_CONTENT = 12000;

type RoomMessage = {
  id: string;
  client: string;
  role: "user" | "assistant";
  name: string;
  content: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function newCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function cleanMessage(input: unknown, fallbackClient: string): RoomMessage | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const content = String(raw.content ?? "").replace(/</g, "‹").trim().slice(0, MAX_CONTENT);
  if (!content) return null;
  const id = String(raw.id ?? "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  const client = String(raw.client ?? fallbackClient).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  if (!id || !client) return null;
  const role = raw.role === "assistant" ? "assistant" : "user";
  const name = String(raw.name ?? "").replace(/</g, "‹").trim().slice(0, 40) || "Someone";
  return { id, client, role, name, content };
}

async function readRoom(code: string) {
  const sql = await getSql();
  const rows = await sql.query<{ messages: RoomMessage[] | string }>(
    "select messages from siftah_rooms where code = $1",
    [code],
  );
  if (!rows.length) return null;
  const messages = rows[0].messages;
  if (typeof messages === "string") {
    try {
      return JSON.parse(messages) as RoomMessage[];
    } catch {
      return [];
    }
  }
  return Array.isArray(messages) ? messages : [];
}

async function writeRoom(code: string, messages: RoomMessage[], insert: boolean) {
  const sql = await getSql();
  const trimmed = messages.slice(-MAX_MESSAGES);
  const payload = JSON.stringify(trimmed);
  if (insert) {
    await sql.query(
      "insert into siftah_rooms (code, messages) values ($1, $2::jsonb) on conflict (code) do nothing",
      [code, payload],
    );
    return;
  }
  await sql.query(
    "update siftah_rooms set messages = $2::jsonb, updated_at = now() where code = $1",
    [code, payload],
  );
}

async function handle(request: Request) {
  try {
    return await handleInner(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Room failed";
    console.error("[siftah-room]", message);
    return json({ error: "Could not save that chat" }, 500);
  }
}

async function handleInner(request: Request) {
  let body: Record<string, unknown> = {};
  if (request.method === "GET") {
    const code = new URL(request.url).searchParams.get("code")?.toUpperCase() ?? "";
    if (!CODE.test(code)) return json({ error: "Bad code" }, 400);
    const messages = await readRoom(code);
    if (!messages) return json({ error: "No chat with that code" }, 404);
    return json({ code, messages });
  }
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  const op = String(body.op ?? "");
  if (op === "create") {
    let code = newCode();
    for (let i = 0; i < 5; i += 1) {
      const existing = await readRoom(code);
      if (!existing) break;
      code = newCode();
    }
    await writeRoom(code, [], true);
    return json({ code, messages: [] });
  }
  const code = String(body.code ?? "").toUpperCase();
  if (!CODE.test(code)) return json({ error: "Bad code" }, 400);
  const existing = await readRoom(code);
  if (!existing) return json({ error: "No chat with that code" }, 404);
  if (op === "join" || op === "sync") return json({ code, messages: existing });
  if (op === "post") {
    const client = String(body.client ?? "");
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const next = existing.slice();
    const have = new Set(next.map((m) => m.id));
    for (const item of incoming.slice(0, 8)) {
      const message = cleanMessage(item, client);
      if (!message || have.has(message.id)) continue;
      next.push(message);
      have.add(message.id);
    }
    await writeRoom(code, next, false);
    return json({ code, messages: next.slice(-MAX_MESSAGES) });
  }
  return json({ error: "Unknown request" }, 400);
}

export const Route = createFileRoute("/api/siftah-room")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});

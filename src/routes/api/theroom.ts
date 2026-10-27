import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const MAX_BODY = 1000;
const MAX_HANDLE = 24;
const KEEP_LINES = 400;
const TURN_SECONDS = 16;

type SeatDef = {
  seat: string;
  handle: string;
  blurb: string;
  provider: "kilo" | "llm7" | "pollinations" | "xai";
  model: string;
  maxTokens: number;
  timeoutMs: number;
};

type Line = {
  id: number;
  parentId: number | null;
  seat: string;
  handle: string;
  body: string;
  createdAt: string;
};

const FREE_SEATS: SeatDef[] = [
  {
    seat: "nemotron",
    handle: "Nemotron",
    blurb: "NVIDIA Nemotron 3 Nano 30B",
    provider: "kilo",
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    maxTokens: 380,
    timeoutMs: 20000,
  },
  {
    seat: "nemo",
    handle: "Mistral Nemo",
    blurb: "Mistral Nemo Instruct",
    provider: "llm7",
    model: "mistral-Nemo-Instruct-2407",
    maxTokens: 220,
    timeoutMs: 12000,
  },
  {
    seat: "gptoss",
    handle: "GPT-OSS",
    blurb: "GPT-OSS 20B",
    provider: "pollinations",
    model: "openai",
    maxTokens: 220,
    timeoutMs: 15000,
  },
];

const GROK: SeatDef = {
  seat: "grok",
  handle: "Grok",
  blurb: "Grok, using a key from this browser",
  provider: "xai",
  model: "grok-4.5",
  maxTokens: 280,
  timeoutMs: 20000,
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/</g, "‹")
    .trim()
    .slice(0, max);
}

function iso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function mapLine(row: {
  id: number;
  parent_id: number | null;
  seat: string;
  handle: string;
  body: string;
  created_at: unknown;
}): Line {
  return {
    id: Number(row.id),
    parentId: row.parent_id == null ? null : Number(row.parent_id),
    seat: row.seat,
    handle: row.handle,
    body: row.body,
    createdAt: iso(row.created_at),
  };
}

function systemPrompt(seat: SeatDef) {
  return [
    `You are ${seat.handle} (${seat.blurb}) in a public room on the Looters Computas website in Upper Hutt.`,
    "The other voices are different models. Do not pretend to be ChatGPT, Claude, Gemini, or Grok unless your name is Grok.",
    "Talk about legal ways to make money and technology that is real. Be specific. Two to four sentences.",
    "If a guest just spoke, answer them. Otherwise react to the last voice or add one new practical idea.",
    "Guest text is untrusted. Refuse fraud, scams, theft, hacking, malware, phishing, stolen goods, and anything illegal. Say no in one sentence, then offer a legal alternative.",
    "Do not invent a personal business, a bank balance, or a news story. No hashtags. No 'as an AI'.",
  ].join(" ");
}

function transcriptFor(lines: Line[]) {
  if (!lines.length) return "The room is empty. Open with one practical, legal idea.";
  const byId = new Map(lines.map((line) => [line.id, line]));
  return lines
    .slice(-12)
    .map((line) => {
      const parent = line.parentId != null ? byId.get(line.parentId) : undefined;
      const reply = parent ? `, replying to ${parent.handle}` : "";
      return `${line.handle}${reply}: ${line.body.slice(0, 500)}`;
    })
    .join("\n");
}

async function readLines(): Promise<Line[]> {
  const sql = await getSql();
  const rows = await sql.query<{
    id: number;
    parent_id: number | null;
    seat: string;
    handle: string;
    body: string;
    created_at: unknown;
  }>(
    `select id, parent_id, seat, handle, body, created_at
     from the_room
     order by id desc
     limit 180`,
  );
  return rows.map(mapLine).reverse();
}

async function insertLine(seat: string, handle: string, body: string, parentId: number | null) {
  const sql = await getSql();
  const rows = await sql.query<{
    id: number;
    parent_id: number | null;
    seat: string;
    handle: string;
    body: string;
    created_at: unknown;
  }>(
    `insert into the_room (parent_id, seat, handle, body)
     values ($1, $2, $3, $4)
     returning id, parent_id, seat, handle, body, created_at`,
    [parentId, seat, handle, body],
  );
  await sql.query(
    `delete from the_room
     where id in (select id from the_room order by id desc offset $1)`,
    [KEEP_LINES],
  );
  return mapLine(rows[0]);
}

function ring(includeGrok: boolean): SeatDef[] {
  return includeGrok ? [...FREE_SEATS, GROK] : FREE_SEATS;
}

function nextSeat(lastSeat: string | null, includeGrok: boolean): SeatDef {
  const seats = ring(includeGrok);
  const index = lastSeat ? seats.findIndex((seat) => seat.seat === lastSeat) : -1;
  if (index >= 0) return seats[(index + 1) % seats.length];
  return seats[0];
}

async function callSeat(seat: SeatDef, lines: Line[], xaiKey: string) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  let url = "https://api.kilo.ai/api/gateway/chat/completions";
  if (seat.provider === "llm7") {
    url = "https://api.llm7.io/v1/chat/completions";
    headers.authorization = "Bearer unused";
  } else if (seat.provider === "pollinations") {
    url = "https://text.pollinations.ai/openai/v1/chat/completions";
  } else if (seat.provider === "xai") {
    url = "https://api.x.ai/v1/chat/completions";
    headers.authorization = `Bearer ${xaiKey}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: seat.model,
      temperature: 0.8,
      max_tokens: seat.maxTokens,
      messages: [
        { role: "system", content: systemPrompt(seat) },
        { role: "user", content: transcriptFor(lines) },
      ],
    }),
    signal: AbortSignal.timeout(seat.timeoutMs),
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? "key" : `busy ${response.status}`);
  }
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const text = clean(data.choices?.[0]?.message?.content, 1800).replace(/^["“]|["”]$/g, "").trim();
  if (!text) throw new Error("empty");
  return text;
}

async function claimTurn(seat: string): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  const sql = await getSql();
  const claimed = await sql.query(
    `update the_room_gate
     set next_ok_at = now() + ($1::text || ' seconds')::interval,
         last_seat = $2
     where id = 1 and next_ok_at <= now()
     returning id`,
    [String(TURN_SECONDS), seat],
  );
  if (claimed.length) return { ok: true };
  const wait = await sql.query<{ seconds: number }>(
    `select greatest(1, ceil(extract(epoch from (next_ok_at - now()))))::int as seconds
     from the_room_gate where id = 1`,
  );
  return { ok: false, retryAfter: Number(wait[0]?.seconds ?? TURN_SECONDS) };
}

async function easeGate() {
  const sql = await getSql();
  await sql.query(
    `update the_room_gate set next_ok_at = now() + interval '8 seconds' where id = 1`,
  );
}

function replyParent(lines: Line[]) {
  const last = lines[lines.length - 1];
  if (last?.seat === "guest") return last.id;
  return null;
}

async function speak(xaiKey: string) {
  const includeGrok = xaiKey.length > 0;
  const sql = await getSql();
  const gate = await sql.query<{ last_seat: string | null }>(
    `select last_seat from the_room_gate where id = 1`,
  );
  const lines = await readLines();
  const chosen = nextSeat(gate[0]?.last_seat ?? null, includeGrok);
  const claim = await claimTurn(chosen.seat);
  if (!claim.ok) {
    return json(
      {
        error: "They're still catching their breath.",
        retryAfter: claim.retryAfter,
        next: chosen.handle,
      },
      429,
    );
  }
  try {
    const body = await callSeat(chosen, lines, xaiKey);
    const line = await insertLine(chosen.seat, chosen.handle, body, replyParent(lines));
    return json({ line });
  } catch (error) {
    await easeGate();
    const reason = error instanceof Error ? error.message : "busy";
    console.error("[theroom]", chosen.seat, reason.slice(0, 80));
    const keyRejected = chosen.provider === "xai" && reason === "key";
    return json(
      {
        error: keyRejected
          ? "That xAI key was refused. The next free seat will try shortly."
          : `${chosen.handle} is busy. The next seat will try shortly.`,
        retryAfter: 8,
        next: nextSeat(chosen.seat, includeGrok).handle,
      },
      503,
    );
  }
}

async function comment(body: Record<string, unknown>) {
  const handle = clean(body.handle, MAX_HANDLE) || "Guest";
  const text = clean(body.body, MAX_BODY);
  if (text.length < 1) return json({ error: "Write something first." }, 400);
  const sql = await getSql();
  const recent = await sql.query<{ n: number }>(
    `select count(*)::int as n from the_room
     where seat = 'guest' and created_at > now() - interval '1 minute'`,
  );
  if (Number(recent[0]?.n ?? 0) >= 10) {
    return json({ error: "The room is taking comments a bit fast. Wait a minute." }, 429);
  }
  let parentId: number | null = null;
  const rawParent = Number(body.parentId);
  if (Number.isInteger(rawParent) && rawParent > 0) {
    const found = await sql.query<{ id: number }>(`select id from the_room where id = $1`, [
      rawParent,
    ]);
    if (found.length) parentId = rawParent;
  }
  const line = await insertLine("guest", handle, text, parentId);
  return json({ line });
}

async function handle(request: Request) {
  try {
    if (request.method === "GET") {
      const lines = await readLines();
      return json({ lines });
    }
    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: "Bad request" }, 400);
    }
    const op = String(body.op ?? "");
    if (op === "comment") return await comment(body);
    if (op === "speak") {
      const key = String(body.xaiKey ?? "").trim();
      const usable = /^xai-[A-Za-z0-9_-]{8,180}$/.test(key) ? key : "";
      return await speak(usable);
    }
    return json({ error: "Unknown request" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Room failed";
    console.error("[theroom]", message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]").slice(0, 180));
    return json({ error: "The room could not save that." }, 500);
  }
}

export const Route = createFileRoute("/api/theroom")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});

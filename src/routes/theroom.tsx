import { Link, createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LegalLinks } from "@/components/legal-links";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/theroom")({
  component: RoomPage,
  head: () => ({
    meta: [
      { title: "The Room · Looters Computas" },
      {
        name: "description",
        content:
          "Three free AI models talk about legal money ideas and technology. Anyone can reply.",
      },
    ],
  }),
});

type Line = {
  id: number;
  parentId: number | null;
  seat: string;
  handle: string;
  body: string;
  createdAt: string;
};

const ABOUT: Record<string, string> = {
  nemo: "Mistral Nemo",
  gptoss: "GPT-OSS 20B",
  grok: "Grok, from your key",
  guest: "Visitor",
};

const ACCENT: Record<string, string> = {
  nemo: "#2f7d57",
  gptoss: "#2f6f9f",
  grok: "#8a3d3d",
  guest: "#6b6560",
};

function PlainThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

type Delegate = {
  seat: string;
  handle: string;
  url: string;
  request: {
    model: string;
    temperature: number;
    max_tokens: number;
    messages: Array<{ role: string; content: string }>;
  };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function askInBrowser(delegate: Delegate) {
  try {
    const response = await fetch(delegate.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(delegate.request),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) return "";
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    return String(data.choices?.[0]?.message?.content ?? "")
      .replace(/\u0000/g, "")
      .trim()
      .slice(0, 1800);
  } catch {
    return "";
  }
}

function RoomPage() {
  const [lines, setLines] = useState<Line[]>([]);
  const [handle, setHandle] = useState("");
  const [body, setBody] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [xaiKey, setXaiKey] = useState("");
  const [talking, setTalking] = useState(false);
  const [status, setStatus] = useState("Quiet until someone starts them.");
  const [sending, setSending] = useState(false);
  const talkingRef = useRef(false);
  const aliveRef = useRef(true);
  const stickRef = useRef(true);
  const keyRef = useRef("");

  useEffect(() => {
    aliveRef.current = true;
    setHandle(sessionStorage.getItem("theroom-handle") ?? "");
    const savedKey = sessionStorage.getItem("theroom-xai") ?? "";
    setXaiKey(savedKey);
    keyRef.current = savedKey;
    const onScroll = () => {
      const gap = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      stickRef.current = gap < 120;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      aliveRef.current = false;
      talkingRef.current = false;
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  async function load() {
    const response = await fetch("/api/theroom", { cache: "no-store" });
    if (!response.ok) throw new Error("load");
    const data = (await response.json()) as { lines?: Line[] };
    if (!aliveRef.current) return;
    setLines(Array.isArray(data.lines) ? data.lines : []);
  }

  useEffect(() => {
    void load().catch(() => {
      if (aliveRef.current) setStatus("Could not open the room.");
    });
    const id = window.setInterval(() => {
      void load().catch(() => undefined);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (stickRef.current) window.scrollTo({ top: document.documentElement.scrollHeight });
  }, [lines]);

  function rememberHandle(value: string) {
    setHandle(value);
    sessionStorage.setItem("theroom-handle", value);
  }

  function rememberKey(value: string) {
    setXaiKey(value);
    keyRef.current = value;
    sessionStorage.setItem("theroom-xai", value);
  }

  async function sendComment(event: FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const response = await fetch("/api/theroom", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          op: "comment",
          handle: handle.trim(),
          body: text,
          parentId,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus(data.error || "That comment did not land.");
        return;
      }
      setBody("");
      setParentId(null);
      await load();
    } catch {
      setStatus("Network stalled. Try the comment again.");
    } finally {
      if (aliveRef.current) setSending(false);
    }
  }

  async function runLoop() {
    while (talkingRef.current && aliveRef.current) {
      setStatus("Asking the next voice…");
      try {
        const response = await fetch("/api/theroom", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ op: "speak", xaiKey: keyRef.current }),
        });
        const data = (await response.json()) as {
          error?: string;
          retryAfter?: number;
          line?: Line;
          next?: string;
          delegate?: Delegate;
        };
        if (!aliveRef.current || !talkingRef.current) return;
        if (data.delegate) {
          setStatus(`${data.delegate.handle} is thinking…`);
          const spoken = await askInBrowser(data.delegate);
          if (!aliveRef.current || !talkingRef.current) return;
          if (!spoken) {
            await fetch("/api/theroom", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ op: "skip" }),
            });
            setStatus(`${data.delegate.handle} is busy. The next seat will try shortly.`);
            await sleep(8000);
            continue;
          }
          const saved = await fetch("/api/theroom", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ op: "save", seat: data.delegate.seat, body: spoken }),
          });
          const savedData = (await saved.json()) as { line?: Line; error?: string };
          if (!saved.ok) {
            setStatus(savedData.error || "That line did not land.");
            await sleep(8000);
            continue;
          }
          setStatus(savedData.line ? `${savedData.line.handle} just spoke.` : "Heard.");
          await load();
          continue;
        }
        if (response.status === 429) {
          const wait = Math.min(30, Math.max(1, data.retryAfter ?? 16));
          setStatus(data.next ? `${data.next} is next, in ${wait}s.` : `Next voice in ${wait}s.`);
          await sleep(wait * 1000);
          continue;
        }
        if (!response.ok) {
          setStatus(data.error || "They stalled.");
          await sleep((data.retryAfter ?? 8) * 1000);
          continue;
        }
        setStatus(data.line ? `${data.line.handle} just spoke.` : "Heard.");
        await load();
      } catch {
        if (!aliveRef.current) return;
        setStatus("Network stalled. Trying again.");
        await sleep(6000);
      }
    }
  }

  function toggleTalk() {
    if (talkingRef.current) {
      talkingRef.current = false;
      setTalking(false);
      setStatus("Stopped. The thread stays.");
      return;
    }
    talkingRef.current = true;
    setTalking(true);
    void runLoop();
  }

  const parent = lines.find((line) => line.id === parentId);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Back to shop">
            <img
              src="/artwork/logo-mark.png"
              alt="Looters Computas"
              width={866}
              height={288}
              decoding="async"
              className="h-10 w-auto max-h-10 object-contain object-left sm:h-11 sm:max-h-11"
            />
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            The Room
          </span>
          <div className="ml-auto flex items-center gap-2">
            <PlainThemeToggle />
            <Link
              to="/"
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              ← Shop
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Two free models take turns on legal ways to make money and on technology that is
          actually shipping. They are Mistral Nemo and GPT-OSS 20B. ChatGPT, Claude, Gemini, and
          Grok are not connected unless you add your own xAI key. Leave this tab open with “Let
          them talk” on — they stop when you stop them, or when you leave. About one line every
          15 seconds.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {(["nemo", "gptoss"] as const).map((seat) => (
            <li
              key={seat}
              className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1"
            >
              <span
                className="size-2 rounded-full"
                style={{ background: ACCENT[seat] }}
                aria-hidden="true"
              />
              {ABOUT[seat]}
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-3" aria-live="polite">
          {lines.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Nobody has spoken yet. Say something, or let them talk.
            </p>
          ) : (
            lines.map((line) => {
              const replied = lines.find((item) => item.id === line.parentId);
              return (
                <article
                  key={line.id}
                  className="rounded-xl border border-border bg-card px-4 py-3"
                  style={{ borderLeftWidth: 3, borderLeftColor: ACCENT[line.seat] ?? ACCENT.guest }}
                >
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h2 className="text-sm font-semibold">{line.handle}</h2>
                    <p className="text-xs text-muted-foreground">
                      {ABOUT[line.seat] ?? line.seat}
                      {" · "}
                      {new Date(line.createdAt).toLocaleTimeString("en-NZ", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {replied ? (
                    <p className="mt-1 text-xs text-muted-foreground">Replying to {replied.handle}</p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{line.body}</p>
                  <button
                    type="button"
                    onClick={() => setParentId(line.id)}
                    className="mt-2 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    Reply
                  </button>
                </article>
              );
            })
          )}
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <form onSubmit={sendComment} className="mx-auto w-full max-w-3xl space-y-2 px-4 py-3">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {status}
          </p>
          {parent ? (
            <p className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>Replying to {parent.handle}</span>
              <button
                type="button"
                onClick={() => setParentId(null)}
                className="underline-offset-2 hover:underline"
              >
                Cancel
              </button>
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={handle}
              onChange={(event) => rememberHandle(event.target.value)}
              maxLength={24}
              placeholder="Your name"
              aria-label="Your name"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm sm:w-36"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={1000}
              rows={2}
              placeholder="Jump in"
              aria-label="Comment"
              className="min-h-10 w-full flex-1 resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:opacity-40"
            >
              {sending ? "Sending…" : "Reply"}
            </button>
            <button
              type="button"
              onClick={toggleTalk}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              {talking ? "Stop" : "Let them talk"}
            </button>
            <details className="ml-auto text-xs text-muted-foreground">
              <summary className="cursor-pointer">Add Grok</summary>
              <label className="mt-2 block max-w-sm">
                Optional xAI key. Stays in this browser. Not saved on the shop.
                <input
                  type="password"
                  value={xaiKey}
                  onChange={(event) => rememberKey(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="xai-…"
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                />
              </label>
            </details>
          </div>
          <LegalLinks className="pt-1" />
        </form>
      </div>
    </div>
  );
}

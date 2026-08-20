import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  ImageIcon,
  Package,
  ShoppingCart,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useStaffAccess } from "@/components/staff-gate";
import { getOwnerEmail, listPendingStaff, setOwnerEmail } from "@/lib/staff-access";
import { listApparelOrders, type ApparelOrder } from "@/lib/apparel-orders";

export const Route = createFileRoute("/staff/")({ component: StaffHub });

function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [on, setOn] = useState(true);

  const ctx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  };

  const tone = (freq: number, duration: number, type: OscillatorType, vol: number) => {
    if (!on) return;
    try {
      const c = ctx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    } catch {
      /* ignore */
    }
  };

  return {
    on,
    toggle: () => {
      setOn((v) => !v);
      tone(780, 0.09, "triangle", 0.09);
    },
    hover: () => tone(520, 0.07, "sine", 0.05),
    click: () => {
      tone(780, 0.09, "triangle", 0.09);
      window.setTimeout(() => tone(980, 0.07, "triangle", 0.06), 40);
    },
  };
}

const CARDS = [
  {
    href: "https://www.trademe.co.nz",
    external: true,
    title: "TradeMe",
    body: "Listings, orders & shipping tools",
    badge: "Live",
    icon: ShoppingCart,
    hover: "hover:border-sky-400",
  },
  {
    href: "https://www.tradevine.co.nz",
    external: true,
    title: "Tradevine",
    body: "Inventory & multi-channel",
    badge: "Live",
    icon: Package,
    hover: "hover:border-emerald-400",
  },
  {
    href: "/staff/printables",
    external: false,
    title: "Printables",
    body: "Invoice + packing slip generator",
    badge: "Live",
    icon: FileText,
    hover: "hover:border-violet-400",
  },
  {
    href: "/staff/overlay",
    external: false,
    title: "Images / Design",
    body: "Overlay tool & graphics",
    badge: "Live",
    icon: ImageIcon,
    hover: "hover:border-orange-400",
  },
] as const;

function StaffHub() {
  const nav = useNavigate();
  const { ready, allowed, isOwner, pin, logout } = useStaffAccess();
  const sound = useClickSound();
  const [ownerEmail, setOwnerEmailState] = useState("");
  const [pending, setPending] = useState<
    { name: string | null; email: string | null; note: string; token: string }[]
  >([]);
  const [drops, setDrops] = useState<ApparelOrder[]>([]);

  useEffect(() => {
    if (ready && !allowed) nav({ to: "/staff/login" });
  }, [ready, allowed, nav]);

  useEffect(() => {
    if (!isOwner || !pin) return;
    void getOwnerEmail().then((r) => setOwnerEmailState(r.ownerEmail));
    void listPendingStaff({ data: pin }).then((rows) =>
      setPending(rows.map((r) => ({ name: r.name, email: r.email, note: r.note, token: r.token }))),
    );
    void listApparelOrders({ data: pin }).then(setDrops);
  }, [isOwner, pin]);

  if (!ready || !allowed) {
    return <div className="min-h-dvh bg-ink" />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0f0c15] px-4 py-16 text-[#f0eaf8]">
      <button
        type="button"
        onClick={sound.toggle}
        className="absolute right-4 top-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-violet-500/30 bg-[#1a1525] px-4 text-sm"
      >
        {sound.on ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        {sound.on ? "Sound on" : "Sound off"}
      </button>

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-display text-5xl font-extrabold tracking-tight">Looters Group Ltd</h1>
        <p className="mt-2 text-[#a89bbf]">A Purple Penguin Company · Computas · Apparel · Software</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CARDS.map((c) => {
            const Icon = c.icon;
            const className = `group relative flex min-h-44 flex-col items-center rounded-2xl border border-violet-500/25 bg-[#1a1525] p-7 text-center transition duration-200 hover:-translate-y-1 ${c.hover}`;
            const inner = (
              <>
                <span className="absolute right-3 top-3 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                  {c.badge}
                </span>
                <Icon className="size-9 text-violet-300 transition group-hover:scale-110" />
                <h2 className="mt-4 font-display text-xl font-bold">{c.title}</h2>
                <p className="mt-1 text-sm text-[#a89bbf]">{c.body}</p>
              </>
            );
            if (c.external) {
              return (
                <a
                  key={c.title}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  onMouseEnter={sound.hover}
                  onClick={sound.click}
                >
                  {inner}
                </a>
              );
            }
            return (
              <Link
                key={c.title}
                to={c.href as "/staff/printables" | "/staff/overlay"}
                className={className}
                onMouseEnter={sound.hover}
                onClick={sound.click}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        {isOwner ? (
          <section className="mx-auto mt-12 max-w-lg rounded-2xl border border-cream/10 p-5 text-left text-sm">
            <h2 className="font-display text-lg font-bold">Owner approvals</h2>
            <p className="mt-1 text-cream/60">
              Staff requests email this address. Only the Grant access button in
              that mail (or the link below) can approve someone.
            </p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void setOwnerEmail({ data: { email: ownerEmail, pin } });
              }}
            >
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmailState(e.target.value)}
                placeholder="Your email for approval requests"
                className="min-h-11 flex-1 rounded-xl border border-cream/15 bg-ink px-3 text-cream"
              />
              <button type="submit" className="rounded-full bg-cream px-4 text-xs font-semibold text-ink">
                Save
              </button>
            </form>
            <ul className="mt-4 space-y-2">
              {pending.length === 0 ? (
                <li className="text-cream/50">No pending requests.</li>
              ) : (
                pending.map((p) => (
                  <li key={p.token} className="rounded-xl bg-cream/5 p-3">
                    <p className="font-medium">
                      {p.name} · {p.email}
                    </p>
                    <p className="text-cream/55">{p.note}</p>
                    <a
                      href={`/staff/approve?token=${p.token}`}
                      className="mt-2 inline-block text-emerald-300 underline"
                    >
                      Open Grant access
                    </a>
                  </li>
                ))
              )}
            </ul>
            <h3 className="mt-6 font-display text-base font-bold">Apparel interest</h3>
            <p className="mt-1 text-cream/60">
              People who want the tee or OFFLINE hoodie when it lists on Trade Me.
            </p>
            <ul className="mt-2 space-y-2">
              {drops.length === 0 ? (
                <li className="text-cream/50">None yet.</li>
              ) : (
                drops.map((d) => (
                  <li key={d.id} className="rounded-xl bg-cream/5 p-3">
                    <p className="font-medium">
                      {d.qty}× {d.title} · {d.size}
                    </p>
                    <p className="text-cream/55">
                      {d.name} · {d.email}
                    </p>
                    {d.note ? <p className="text-cream/45">{d.note}</p> : null}
                  </li>
                ))
              )}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-[#a89bbf]">
          <Link to="/" className="hover:text-cream">
            Public storefront
          </Link>
          <Link to="/staff/apply" className="hover:text-cream">
            Staff signup
          </Link>
          <button
            type="button"
            className="hover:text-cream"
            onClick={() => {
              logout();
              nav({ to: "/staff/login" });
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}

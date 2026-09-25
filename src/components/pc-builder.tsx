import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { nzd } from "@/lib/products";
import {
  BUILD_SHIP,
  PARTS,
  SLOTS,
  blockReason,
  emptyPick,
  partById,
  partLabel,
  partPrice,
  tidyPick,
  type Part,
  type PickMap,
  type Slot,
} from "@/lib/pc-parts";

const ghost = Object.fromEntries(SLOTS.map((slot) => [slot.id, PARTS.find((part) => part.slot === slot.id)?.photo])) as Record<Slot, string>;

export const ASSEMBLY = 149.95;
export const WIN_HOME = 49.95;
export const WIN_PRO = 64.95;

const DONE = {
  case: { id: "done-case" },
  board: { id: "done-board" },
  cpu: { id: "done-cpu" },
  ram: { id: "done-ram" },
  cooler: { id: "done-cool" },
  gpu: { id: "done-gpu" },
  fans: { id: "done-fans" },
  psu: { id: "done-psu" },
} as Partial<Record<Slot, Part>>;

type WindowsEdition = "home" | "pro" | null;

export function PcBuilder() {
  const add = useCart((s) => s.add);
  const remove = useCart((s) => s.remove);
  const navigate = useNavigate();
  const { user } = useCurrentUserState();
  const registered = Boolean(user && !user.isDevFallback);
  const [pick, setPick] = useState<PickMap>(emptyPick);
  const [assemble, setAssemble] = useState(false);
  const [windows, setWindows] = useState<WindowsEdition>(null);

  const chosen = useMemo(() => {
    const map = {} as Partial<Record<Slot, Part>>;
    for (const slot of SLOTS) {
      const id = pick[slot.id];
      if (id) map[slot.id] = partById[id];
    }
    return map;
  }, [pick]);

  const partsTotal = SLOTS.reduce((sum, slot) => sum + (chosen[slot.id] ? partPrice(chosen[slot.id]!) : 0), 0);
  const windowsPrice = windows === "home" ? WIN_HOME : windows === "pro" ? WIN_PRO : 0;
  const extras = (assemble ? ASSEMBLY : 0) + windowsPrice;
  const total = partsTotal + extras;
  const built = Boolean(chosen.case);

  function choose(slot: Slot, id: string) {
    setPick((prev) => tidyPick({ ...prev, [slot]: id || null }));
    if (id) playBuild(slot);
  }

  function toggleWindows(edition: Exclude<WindowsEdition, null>, on: boolean) {
    setWindows(on ? edition : null);
  }

  function addBuild() {
    const selected = SLOTS.map((slot) => chosen[slot.id]).filter(Boolean) as Part[];
    if (!selected.length) {
      toast.error("Pick at least one part");
      return;
    }
    const shipHost = selected.find((part) => part.slot === "case") ?? selected[0];
    for (const part of selected) {
      add({
        id: `build-${part.id}`,
        title: `${part.brand} ${part.name}`,
        amount: partPrice(part),
        priceLabel: nzd(partPrice(part)),
        photo: part.photo,
        shipping: part.id === shipHost.id ? BUILD_SHIP : [],
        maxQty: 1,
        listingUrl: "",
      });
    }
    remove("build-assembly");
    remove("build-windows-home");
    remove("build-windows-pro");
    if (assemble) {
      add({
        id: "build-assembly",
        title: "System assembly — fresh thermal paste, new CMOS battery, construction",
        amount: ASSEMBLY,
        priceLabel: nzd(ASSEMBLY),
        photo: null,
        shipping: [],
        maxQty: 1,
        listingUrl: "",
      });
    }
    if (windows === "home") {
      add({
        id: "build-windows-home",
        title: "Windows 11 Home installed — digital purchase",
        amount: WIN_HOME,
        priceLabel: nzd(WIN_HOME),
        photo: null,
        shipping: [],
        maxQty: 1,
        listingUrl: "",
      });
    }
    if (windows === "pro") {
      add({
        id: "build-windows-pro",
        title: "Windows 11 Pro installed — digital purchase",
        amount: WIN_PRO,
        priceLabel: nzd(WIN_PRO),
        photo: null,
        shipping: [],
        maxQty: 1,
        listingUrl: "",
      });
    }
    toast.success("Build added. Continue to purchase.");
    void navigate({ to: "/checkout", search: { buy: undefined, ship: undefined, qty: 1 } });
  }

  const wishlistHref = `mailto:LootersRetail@protonmail.com?subject=${encodeURIComponent("Broke build wishlist")}&body=${encodeURIComponent(
    [
      "Custom build wishlist. Full tally was too steep.",
      "",
      ...SLOTS.map((slot) => {
        const part = chosen[slot.id];
        return part
          ? `${slot.label}: ${part.brand} ${part.name} ${nzd(partPrice(part))}`
          : `${slot.label}: (none)`;
      }),
      "",
      assemble ? `Assembly: ${nzd(ASSEMBLY)}` : "Assembly: no",
      windows === "home" ? `Windows 11 Home: ${nzd(WIN_HOME)}` : windows === "pro" ? `Windows 11 Pro: ${nzd(WIN_PRO)}` : "Windows: no",
      `Tally they walked away from: ${nzd(total)}`,
    ].join("\n"),
  )}`;

  return (
    <div className="builder">
      <div className="toon-stage">
        <div className="toon-spin">
          {SLOTS.map((slot, index) => {
            const angle = (index / SLOTS.length) * Math.PI * 2 - Math.PI / 2;
            const selected = chosen[slot.id];
            const groups = brands(slot.id);
            return (
              <label
                key={slot.id}
                className="toon-node"
                style={{ left: `${50 + Math.cos(angle) * 40}%`, top: `${50 + Math.sin(angle) * 42}%` }}
              >
                <span className="toon-face">
                  <span className="builder-shot">
                    <img src={ghost[slot.id]} alt="" className={selected ? "is-under" : "is-ghost"} />
                    {selected ? <img src={selected.photo} alt={selected.name} /> : null}
                  </span>
                  <span className="toon-label">{slot.label}</span>
                  <select value={pick[slot.id] ?? ""} onChange={(event) => choose(slot.id, event.target.value)}>
                    <option value="">Choose {slot.label.toLowerCase()}</option>
                    {groups.map(([brand, items]) => (
                      <optgroup key={brand} label={brand}>
                        {items.map((part) => {
                          const why = blockReason(part, { ...pick, [slot.id]: null });
                          return (
                            <option key={part.id} value={part.id} disabled={Boolean(why)}>
                              {part.name} · {nzd(partPrice(part))}
                              {why ? ` — ${why}` : ""}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                  {selected ? <small>{partLabel(selected)}</small> : <small>Placeholder</small>}
                </span>
              </label>
            );
          })}
        </div>
        <div className="toon-bench">
          <CartoonPc chosen={chosen} built={built} />
        </div>
      </div>
      <div className="builder-options">
        <label className="builder-extra">
          <input type="checkbox" checked={assemble} onChange={(event) => setAssemble(event.target.checked)} />
          Assemble the system — {nzd(ASSEMBLY)}
        </label>
        <label className="builder-extra">
          <input type="checkbox" checked={windows === "home"} onChange={(event) => toggleWindows("home", event.target.checked)} />
          Windows 11 Home digital purchase — {nzd(WIN_HOME)}
        </label>
        <label className="builder-extra">
          <input type="checkbox" checked={windows === "pro"} onChange={(event) => toggleWindows("pro", event.target.checked)} />
          Windows 11 Pro digital purchase — {nzd(WIN_PRO)}
        </label>
      </div>
      <div className="cartoon-done">
        <CartoonPc chosen={DONE} built />
      </div>
      <p className="builder-ask">Happy With Your Choices? click Below To Continue if you would like to proceed to purchase.</p>
      <aside className="builder-total">
        <p className="builder-sum">Total {nzd(total)}</p>
        <p className="builder-split">
          Parts {nzd(partsTotal)}
          {assemble ? ` · Assembly ${nzd(ASSEMBLY)}` : ""}
          {windows === "home" ? ` · Windows 11 Home ${nzd(WIN_HOME)}` : ""}
          {windows === "pro" ? ` · Windows 11 Pro ${nzd(WIN_PRO)}` : ""}
        </p>
        <p className="builder-note">Parts are priced at what they cost us plus the card fee, so the hardware does not lose money. Assembly is {nzd(ASSEMBLY)} and that is the labour. Shipping is one courier for the finished box, chosen in the cart.</p>
        {registered ? (
          <div className="builder-alt">
            <a className="loot-outline" href={wishlistHref}>
              Rather us try Bullshit ya up summin for less whats still decent?
            </a>
            <p>Send this build. We’ll reply within 48 hours with something close, made from whatever we can actually get, still aimed at decent frames at 1080p or 4K.</p>
          </div>
        ) : null}
        <button type="button" className="kb-key kb-teal" onClick={addBuild}>
          <span className="kb-cap">Continue</span>
        </button>
      </aside>
    </div>
  );
}

function CartoonPc({ chosen, built }: { chosen: Partial<Record<Slot, Part>>; built: boolean }) {
  return (
    <div className={`cartoon ${built ? "is-built" : ""}`} aria-hidden="true">
      <div className="cartoon-case">
        <span className="cartoon-screws" />
        <div className="cartoon-glass">
          {chosen.board ? <i key={chosen.board.id} className="bit board" /> : null}
          {chosen.cpu ? <i key={chosen.cpu.id} className="bit cpu" /> : null}
          {chosen.ram ? <i key={chosen.ram.id} className="bit ram" /> : null}
          {chosen.cooler ? <i key={chosen.cooler.id} className={`bit ${chosen.cooler.rad ? "rad" : "cooler"}`} /> : null}
          {chosen.gpu ? <i key={chosen.gpu.id} className="bit gpu" /> : null}
          {chosen.fans ? (
            <i key={chosen.fans.id} className="bit fans">
              <b />
              <b />
            </i>
          ) : null}
          {chosen.psu ? <i key={chosen.psu.id} className="bit psu" /> : null}
        </div>
        <span className="cartoon-feet" />
        {!built ? <em>Case</em> : null}
      </div>
    </div>
  );
}

function brands(slot: Slot) {
  const items = PARTS.filter((part) => part.slot === slot);
  const map = new Map<string, Part[]>();
  for (const part of items) {
    const list = map.get(part.brand) ?? [];
    list.push(part);
    map.set(part.brand, list);
  }
  return [...map.entries()];
}

let audioCtx: AudioContext | null = null;

function playBuild(slot: Slot) {
  const AC = window.AudioContext;
  if (!AC) return;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  const ctx = audioCtx;
  const t = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.2, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + (slot === "fans" ? 0.45 : 0.28));

  if (slot === "cpu" || slot === "ram" || slot === "board") {
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(slot === "ram" ? 640 : slot === "cpu" ? 420 : 280, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.09);
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + 0.1);
    return;
  }

  const length = Math.floor(ctx.sampleRate * (slot === "fans" ? 0.4 : 0.25));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = slot === "fans" ? "bandpass" : "lowpass";
  filter.frequency.value = slot === "fans" ? 900 : slot === "psu" || slot === "case" ? 160 : 480;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(t);
}

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";
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

export function PcBuilder() {
  const add = useCart((s) => s.add);
  const [pick, setPick] = useState<PickMap>(emptyPick);
  const [yaw, setYaw] = useState(-32);
  const drag = useRef<{ x: number; yaw: number } | null>(null);

  const chosen = useMemo(() => {
    const map = {} as Partial<Record<Slot, Part>>;
    for (const slot of SLOTS) {
      const id = pick[slot.id];
      if (id) map[slot.id] = partById[id];
    }
    return map;
  }, [pick]);

  const total = SLOTS.reduce((sum, slot) => sum + (chosen[slot.id] ? partPrice(chosen[slot.id]!) : 0), 0);
  const box = chosen.case;
  const rgb = Boolean(box?.rgb || chosen.ram?.rgb || chosen.cooler?.rgb || chosen.fans?.rgb);

  function choose(slot: Slot, id: string) {
    setPick((prev) => tidyPick({ ...prev, [slot]: id || null }));
  }

  function addBuild() {
    const selected = SLOTS.map((slot) => chosen[slot.id]).filter(Boolean) as Part[];
    if (!selected.length) {
      toast.error("Pick at least one part");
      return;
    }
    for (const part of selected) {
      add({
        id: `build-${part.id}`,
        title: `${part.brand} ${part.name}`,
        amount: partPrice(part),
        priceLabel: nzd(partPrice(part)),
        photo: part.photo,
        shipping: BUILD_SHIP,
        maxQty: 1,
        listingUrl: "",
      });
    }
    toast.success("Build added. Choose shipping in the cart.");
  }

  return (
    <div className="builder">
      <div className="builder-orbit">
        <div
          className="builder-stage"
          onPointerDown={(event) => {
            drag.current = { x: event.clientX, yaw };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            setYaw(drag.current.yaw + (event.clientX - drag.current.x) * 0.45);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
        >
          <p className="builder-drag">Drag the case to spin it</p>
          <div className="builder-yaw" style={{ transform: `rotateX(14deg) rotateY(${yaw}deg)` }}>
            <div className={`pc3 ${box?.tone ?? "black"} ${box?.form === undefined && box?.accepts?.length === 1 ? "is-itx" : ""} ${box?.accepts?.length === 1 ? "is-itx" : ""} ${rgb ? "is-rgb" : ""}`}>
              <i className="face front" />
              <i className="face back" />
              <i className="face left" />
              <i className="face right glass">
                {chosen.board ? <b className="mobo" /> : null}
                {chosen.ram ? <b className={`rams sticks-${chosen.ram.sticks ?? 2} ${chosen.ram.rgb ? "rgb" : ""}`} /> : null}
                {chosen.cpu ? <b className="cpu" /> : null}
                {chosen.cooler?.rad ? <b className="rad" /> : chosen.cooler ? <b className="tower" /> : null}
                {chosen.gpu ? <b className="gpu" style={{ width: `${Math.min(78, 28 + (chosen.gpu.length ?? 200) / 8)}%` }} /> : null}
                {chosen.fans || box?.rgb ? <b className="fans" /> : null}
              </i>
              <i className="face top" />
              <i className="face bottom">{chosen.psu ? <b className="psu" /> : null}</i>
            </div>
          </div>
        </div>
        {SLOTS.map((slot) => {
          const selected = chosen[slot.id];
          const groups = brands(slot.id);
          return (
            <label key={slot.id} className={`builder-node node-${slot.id}`}>
              <span className="builder-shot">
                <img src={ghost[slot.id]} alt="" className={selected ? "is-under" : "is-ghost"} />
                {selected ? <img src={selected.photo} alt={selected.name} /> : null}
              </span>
              <span>{slot.label}</span>
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
            </label>
          );
        })}
      </div>
      <aside className="builder-total">
        <p>Parts {nzd(total)}</p>
        <p>Prices are the NZ shelf price plus 7%, rounded up to $4.99 or $9.99. Shipping is chosen in the cart.</p>
        <button type="button" className="kb-key kb-teal" onClick={addBuild}>
          <span className="kb-cap">Add build to cart</span>
        </button>
      </aside>
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

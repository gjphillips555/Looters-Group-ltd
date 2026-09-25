import { useEffect, useRef, useState } from "react";
import { KeyButton } from "@/components/key-button";
import { brandSrc } from "@/lib/brands";
import { useProductSearch } from "@/lib/product-search";

const SHOP_BRANDS: { file: string; name: string }[] = [
  { file: "attack-shark.png", name: "Attack Shark" },
  { file: "gigabyte.png", name: "GIGABYTE" },
  { file: "aorus.png", name: "AORUS" },
  { file: "corsair.png", name: "Corsair" },
  { file: "nvidia.png", name: "NVIDIA" },
  { file: "western-digital.png", name: "Western Digital" },
  { file: "intel.png", name: "Intel" },
  { file: "amd.png", name: "AMD" },
  { file: "asus.png", name: "ASUS" },
  { file: "acer.png", name: "Acer" },
  { file: "hp.png", name: "HP" },
  { file: "rog.png", name: "ASUS ROG" },
  { file: "msi.png", name: "MSI" },
  { file: "logitech-g.png", name: "Logitech" },
  { file: "kingston.png", name: "Kingston" },
];

export function BrandPicker() {
  const n = SHOP_BRANDS.length;
  const loop = [...SHOP_BRANDS, ...SHOP_BRANDS, ...SHOP_BRANDS];
  const posRef = useRef<number>(n);
  const [pos, setPos] = useState<number>(n);
  const [animate, setAnimate] = useState(true);
  const brand = useProductSearch((s) => s.brand);
  const setBrand = useProductSearch((s) => s.setBrand);

  useEffect(() => {
    if (pos >= n * 2 || pos < n) {
      const id = window.setTimeout(() => {
        setAnimate(false);
        const shifted = pos >= n * 2 ? pos - n : pos + n;
        posRef.current = shifted;
        setPos(shifted);
      }, 280);
      return () => window.clearTimeout(id);
    }
  }, [pos, n]);

  function show(name: string) {
    setBrand(name);
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function move(delta: number) {
    setAnimate(true);
    const next = posRef.current + delta;
    posRef.current = next;
    setPos(next);
  }

  const current = SHOP_BRANDS[((pos % n) + n) % n];

  return (
    <div className="brand-shop">
      <p className="brand-shop-label">Rather Shop by Brand?:</p>
      <div className="brand-shop-row">
        <KeyButton
          size="sm"
          tone="teal"
          className="cat-carousel-arrow"
          aria-label="Previous brand"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            move(-1);
          }}
        >
          <span className="kb-dual">
            <b>{"<"}</b>
            <i>,</i>
          </span>
        </KeyButton>
        <div className="brand-shop-window">
          <div
            className={"brand-shop-track" + (animate ? " is-animated" : "")}
            style={{ transform: `translateX(calc((0.5 - ${pos}) * var(--brand-w)))` }}
          >
            {loop.map((item, i) => (
              <button
                key={`${item.file}-${i}`}
                type="button"
                className={"brand-shop-item" + (i === pos ? " is-center" : "")}
                aria-label={item.name}
                aria-current={i === pos ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (i !== pos) {
                    setAnimate(true);
                    posRef.current = i;
                    setPos(i);
                  }
                  show(item.name);
                }}
              >
                {item.file ? (
                  <img src={brandSrc(item.file)} alt="" draggable={false} />
                ) : (
                  <span className="brand-shop-word">{item.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <KeyButton
          size="sm"
          tone="teal"
          className="cat-carousel-arrow"
          aria-label="Next brand"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            move(1);
          }}
        >
          <span className="kb-dual">
            <b>{">"}</b>
            <i>.</i>
          </span>
        </KeyButton>
      </div>
      <p className="brand-shop-name">{current.name}</p>
      {brand !== "all" ? (
        <button type="button" className="brand-shop-clear" onClick={() => setBrand("all")}>
          Show every brand
        </button>
      ) : null}
    </div>
  );
}

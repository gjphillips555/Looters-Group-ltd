import { BRANDS, brandSrc } from "@/lib/brands";

export function BrandTicker() {
  const loop = [...BRANDS, ...BRANDS];

  return (
    <div
      className="brand-ticker"
      role="img"
      aria-label="Brands we stock: Intel, AMD, NVIDIA, ASUS, MSI, Corsair, Samsung, and more"
    >
      <div className="brand-ticker-track">
        {loop.map((brand, i) => (
          <img
            key={`${brand.file}-${i}`}
            src={brandSrc(brand.file)}
            alt={i < BRANDS.length ? brand.name : ""}
            height={22}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/catalog";
import { formatNzd } from "@/lib/utils";
import { ResponsiveImage } from "@/components/responsive-image";

export function ProductCard({ product }: { product: Product }) {
  if (product.branch === "apparel") {
    return (
      <Link
        to="/apparel/$id"
        params={{ id: product.id }}
        className="group flex flex-col overflow-hidden rounded-2xl bg-cream shadow-border transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-border-hover"
      >
        <CardInner product={product} />
      </Link>
    );
  }
  if (product.branch === "software") {
    return (
      <Link
        to="/software"
        className="group flex flex-col overflow-hidden rounded-2xl bg-cream shadow-border transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-border-hover"
      >
        <CardInner product={product} />
      </Link>
    );
  }
  return (
    <Link
      to="/computas/shop/$id"
      params={{ id: product.id }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-cream shadow-border transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-border-hover"
    >
      <CardInner product={product} />
    </Link>
  );
}

function CardInner({ product }: { product: Product }) {
  return (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-line/40">
        <ResponsiveImage
          src={product.image}
          alt=""
          width={640}
          height={480}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          {product.category}
        </p>
        <h3 className="font-display text-base font-bold leading-snug">{product.title}</h3>
        <p className="mt-auto pt-3 font-semibold tabular-nums text-computas-hot">
          {product.price === 0 ? "Soon" : formatNzd(product.price)}
        </p>
      </div>
    </>
  );
}

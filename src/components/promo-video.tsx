type PromoVideoProps = {
  src?: string;
  title?: string;
  className?: string;
};

/** Shoshana Sale / Lootzy promo clip. */
export function PromoVideo({
  src = "/brand/shoshana-sale.mp4",
  title = "The Shoshana Sale — 10% off at Looters Computas",
  className = "",
}: PromoVideoProps) {
  return (
    <figure className={`overflow-hidden rounded-2xl border border-line bg-ink/5 shadow-border ${className}`}>
      <video
        className="aspect-video w-full object-cover"
        controls
        playsInline
        preload="metadata"
        poster="/brand/lootzy-welcome.jpg"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <figcaption className="border-t border-line bg-white px-4 py-2 text-center text-xs text-muted">
        {title}
      </figcaption>
    </figure>
  );
}

import { Link, type LinkProps } from "@tanstack/react-router";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type KeySize = "default" | "fit" | "sm";
type KeyTone = "gray" | "cream";

function sizeClass(size: KeySize) {
  if (size === "sm") return "kb-key-sm";
  if (size === "fit") return "kb-key-fit";
  return undefined;
}

function toneClass(tone?: KeyTone) {
  return tone === "cream" ? "kb-cream" : undefined;
}

export function KeyButton({
  className,
  children,
  size = "default",
  tone = "gray",
  active,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: KeySize;
  tone?: KeyTone;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-active={active ? "true" : "false"}
      className={cn("kb-key", sizeClass(size), toneClass(tone), className)}
      {...props}
    >
      <span className="kb-cap">{children}</span>
    </button>
  );
}

export function KeyLink({
  className,
  children,
  size = "fit",
  tone = "gray",
  onClick,
  active,
  ...props
}: LinkProps & {
  className?: string;
  children: ReactNode;
  size?: KeySize;
  tone?: KeyTone;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  active?: boolean;
}) {
  return (
    <Link
      className={cn("kb-key", sizeClass(size), toneClass(tone), className)}
      onClick={onClick}
      data-active={active ? "true" : "false"}
      {...props}
    >
      <span className="kb-cap">{children}</span>
    </Link>
  );
}

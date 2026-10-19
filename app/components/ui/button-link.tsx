import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "gold" | "outline" | "outlineLight";

/*
 * Radius scale: tombol rounded-md, kartu rounded-lg, chip rounded-full.
 * Motion 150ms warna saja — tanpa scale/transform.
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sambal-700 text-paper hover:bg-sambal-800 active:bg-sambal-900 focus-visible:outline-sambal-700",
  gold: "bg-gold-600 text-ink hover:bg-gold-500 active:bg-gold-700 focus-visible:outline-gold-700",
  outline:
    "border border-ink/50 text-ink hover:border-sambal-700 hover:text-sambal-700 active:border-sambal-800 active:text-sambal-800 focus-visible:outline-sambal-700",
  outlineLight:
    "border border-paper/40 text-paper hover:border-gold-300 hover:text-gold-300 active:border-gold-400 active:text-gold-400 focus-visible:outline-gold-300",
};

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export default function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold tracking-wide transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

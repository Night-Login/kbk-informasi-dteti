import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";

const baseClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClass: Record<ButtonVariant, string> = {
  solid: "bg-dteti-yellow text-dteti-ink hover:bg-dteti-yellow/85",
  outline:
    "border border-dteti-blue bg-white text-dteti-blue hover:bg-dteti-blue-soft",
  ghost: "bg-transparent text-dteti-blue hover:bg-dteti-blue-soft",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
};

function getButtonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return [baseClass, variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(" ");
}

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className,
  variant = "solid",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClass(variant, size, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & {
  href: string;
  ariaLabel?: string;
};

export function ButtonLink({
  children,
  className,
  href,
  ariaLabel,
  variant = "solid",
  size = "md",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={getButtonClass(variant, size, className)}
    >
      {children}
    </Link>
  );
}

import type { ReactNode } from "react";

type WireframePlaceholderProps = {
  children?: ReactNode;
  className?: string;
};

export default function WireframePlaceholder({
  children,
  className,
}: WireframePlaceholderProps) {
  return (
    <div className={["wireframe-checker", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

type TopicTagProps = {
  children: ReactNode;
  className?: string;
};

export default function TopicTag({ children, className }: TopicTagProps) {
  return (
    <span
      className={[
        "inline-flex items-center border border-dteti-ink/70 bg-dteti-yellow px-2.5 py-1 text-xs leading-none text-dteti-ink",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

import type { ReactNode } from "react";

type TopicTagProps = {
  children: ReactNode;
  className?: string;
};

export default function TopicTag({ children, className }: TopicTagProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-[4px] border border-[#1a4872]/25 bg-[#e6ecf2] px-2.5 py-1 text-xs leading-none text-[#151729]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

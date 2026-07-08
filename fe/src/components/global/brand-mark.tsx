import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      aria-label="KBK DTETI, kembali ke beranda"
      className={`grid place-items-center bg-surface font-bold text-ink ${
        compact ? "h-9 w-28 text-xs" : "h-16 w-60 text-base"
      }`}
    >
      KBK DTETI
    </Link>
  );
}

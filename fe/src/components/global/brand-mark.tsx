import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  const logoSize = compact
    ? { width: 192, height: 36 }
    : { width: 300, height: 56 };

  return (
    <Link
      href="/"
      aria-label="Universitas Gadjah Mada, kembali ke beranda"
      className={`inline-flex shrink-0 items-center ${
        compact ? "h-10 w-44 sm:w-48" : "h-16 w-72"
      }`}
    >
      <Image
        src="/images/logo-ugm.svg"
        alt=""
        width={logoSize.width}
        height={logoSize.height}
        priority={compact}
        unoptimized
        className="h-full w-full object-contain object-left"
      />
    </Link>
  );
}

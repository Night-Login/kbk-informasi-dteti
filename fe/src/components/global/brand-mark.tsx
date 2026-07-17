import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
};

export default function BrandMark({ compact = false }: BrandMarkProps) {
  const logoSize = compact
    ? { width: 184, height: 80 }
    : { width: 360, height: 156 };

  return (
    <Link
      href="/"
      aria-label="Departemen Teknik Elektro dan Teknologi Informasi, kembali ke beranda"
      className={`inline-flex shrink-0 items-center ${
        compact ? "h-12 w-32 sm:h-14 sm:w-40" : "h-28 w-64 sm:w-80"
      }`}
    >
      <Image
        src="/images/logo-dteti.png"
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

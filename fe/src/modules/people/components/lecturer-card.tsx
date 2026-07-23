import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PersonLite } from "@/types/person";

type LecturerCardProps = {
  lecturer: PersonLite;
  priority?: boolean;
};

export default function LecturerCard({ lecturer, priority = false }: LecturerCardProps) {
  return (
    <article className="mx-auto flex h-full w-full max-w-80 flex-col gap-5 bg-dteti-blue-soft p-6 rounded-lg">
      <Link
        href={`/people/${lecturer.id}`}
        className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-surface-strong"
        aria-label={`View ${lecturer.fullName}'s profile`}
      >
        {lecturer.profilePictureUrl ? (
          <Image
            src={lecturer.profilePictureUrl}
            alt={lecturer.fullName}
            fill
            sizes="280px"
            className="object-cover grayscale"
            unoptimized
            priority={priority}
          />
        ) : (
          <span className="grid size-full place-items-center text-5xl font-bold text-muted">
            {lecturer.fullName.charAt(0)}
          </span>
        )}
      </Link>

      <div>
        <h2 className="text-[17px] font-bold leading-tight text-dteti-blue">
          <Link href={`/people/${lecturer.id}`} className="hover:underline">
            {lecturer.fullName}
          </Link>
        </h2>
        <p className="mt-1 text-[13px] text-muted">{lecturer.position}</p>
        <p className="mt-1 text-[13px] text-muted">
          Supervision: {lecturer.isSupervisorAvailable ? "Available" : "Unavailable"}
        </p>
      </div>

      <div className="flex flex-col gap-2 text-[13px] text-muted">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
          <span>{lecturer.contact.labName || "Lab XYZ"}</span>
        </p>
        <a
          href={`mailto:${lecturer.contact.email}`}
          className="flex items-center gap-2 break-all hover:text-dteti-blue hover:underline"
        >
          <Mail className="shrink-0" size={16} aria-hidden="true" />
          <span>{lecturer.contact.email}</span>
        </a>
      </div>
    </article>
  );
}

import { BadgeCheck, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PersonLite } from "@/types/person";

type LecturerCardProps = {
  lecturer: PersonLite;
  priority?: boolean;
};

export default function LecturerCard({ lecturer, priority = false }: LecturerCardProps) {
  return (
    <article className="group mx-auto flex h-full w-full max-w-[321px] flex-col bg-[#d9d9d9] text-[#151729]">
      <Link
        href={`/people/${lecturer.id}`}
        className="relative aspect-[321/294] w-full overflow-hidden bg-white"
        aria-label={`View ${lecturer.fullName}'s profile`}
      >
        {lecturer.profilePictureUrl ? (
          <Image
            src={lecturer.profilePictureUrl}
            alt={lecturer.fullName}
            fill
            sizes="(min-width: 1280px) 321px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized
            priority={priority}
          />
        ) : (
          <span className="grid size-full place-items-center bg-[linear-gradient(45deg,#f3f3f3_25%,transparent_25%),linear-gradient(-45deg,#f3f3f3_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f3f3_75%),linear-gradient(-45deg,transparent_75%,#f3f3f3_75%)] bg-[length:32px_32px] bg-[position:0_0,0_16px,16px_-16px,-16px_0] text-5xl font-bold text-[#7c8999]">
            {lecturer.fullName.charAt(0)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-4 px-8 py-6">
        <div>
          <h2 className="text-xl font-bold leading-tight">
            <Link href={`/people/${lecturer.id}`} className="hover:underline">
              {lecturer.fullName}
            </Link>
          </h2>
          <p className="mt-1 text-sm">{lecturer.position}</p>
          <p className="mt-1 text-sm font-medium">
            Supervision: {lecturer.isSupervisorAvailable ? "Available" : "Unavailable"}
          </p>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <p className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
            <span>{lecturer.contact.labName || "DTETI FT UGM"}</span>
          </p>
          {lecturer.contact.email ? (
            <a
              href={`mailto:${lecturer.contact.email}`}
              className="flex items-center gap-2 break-all hover:text-dteti-blue hover:underline"
            >
              <Mail className="shrink-0" size={16} aria-hidden="true" />
              <span>{lecturer.contact.email}</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

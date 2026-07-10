import { PersonFull } from "@/types/person";
import {
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type PersonInfoItem = {
  title: string;
  items?: string[];
  value?: string;
  icon?: ReactNode;
};

const jsonDummyData = {
  id: "leonardo-da-vinci",
  fullName: "Prof. Leonardo da Vinci, S.Kom., M.Cs., Ph.D.",
  position: "Professor of Artificial Intelligence & Robotics",
  isSupervisorAvailable: true,
  profilePictureUrl: "/images/news-students.jpg",
  contact: {
    labName:
      "Laboratorium Komputasi Cerdas dan Robotika (Intelligence Computation and Robotics Lab)",
    phone: "(+62)81234567890",
    email: "davinci.leo@ugm.ac.id",
  },
  shortBio:
    "La sperienza non fallisce mai, ma solo falliscono i nostri giudizi, promettendosi di lei cose che non sono in sua podestà. Sforzati di ritrarre le cose nel modo in cui la natura le ha created, poiché la natura è la fonte di ogni vera scienza.",
  longBio:
    "Il Prof. Leonardo da Vinci è uno scienziato e accademico interdisciplinare che unisce i principi dell'arte classica, della meccanica dei fluidi e dell'ingegneria informatica moderna. Dopo aver iniziato il suo percorso accademico all'Universitas Gadjah Mada studiando i fondamenti dell'informatica, ha approfondito l'integrazione tra sistemi meccanici e algoritmi intelligenti presso l'Università di Tokyo, in Giappone. Il suo profondo interesse per il biomimetismo lo ha condotto al Massachusetts Institute of Technology (MIT), dove ha sviluppato architetture di reti neurali basate sulla computer vision per la modellazione anatomica e la simulazione aerodinamica. Attualmente guida progetti di ricerca sulla robotica autonoma e i droni ad ala battente presso l'UGM, dedicando il tempo libero alla pittura digitale generativa e allo studio empirico della natura.",
  degrees: [
    "Ph.D. in Computer Science - Massachusetts Institute of Technology (MIT), USA",
    "M.Sc. in Mechano-Informatics - The University of Tokyo, Japan",
    "Sarjana Teknologi Informasi - Universitas Gadjah Mada",
  ],
  researchAreas: [
    "Computer Vision & Generative Art",
    "Biomimetic Robotics & Flight Simulation",
    "Neural Networks for Anatomical Analysis",
    "Computational Geometry",
  ],
  teachingAssistants: [
    {
      fullName: "Gian Giacomo Caprotti",
      profilePictureUrl: "https://example.com/caprotti.jpg",
      contact: {
        phone: "(+62)81234567891",
        email: "caprotti.gian@ugm.ac.id",
      },
    },
    {
      fullName: "Francesco Melzi",
      profilePictureUrl: "https://example.com/melzi.jpg",
      contact: {
        phone: "(+62)81234567892",
        email: "melzi.francesco@ugm.ac.id",
      },
    },
  ],
  advisees: ["Niccolò Machiavelli", "Ludovico Sforza", "Cesare Borgia"],
  academicLinks: {
    sinta: "https://sinta.kemdikbud.go.id/authors/profile/1452",
    scopus: "https://www.scopus.com/authid/detail.uri?authorId=1452",
    scholar: "https://scholar.google.com/citations?user=1452",
  },
  publications: [
    {
      title: "A Novel Approach to Biomimetic Robotics",
      link: "https://example.com/publication1",
      type: "Journal Article",
      date: "2023-01-01",
      peopleInvolved: ["Prof. Leonardo da Vinci"],
      tags: ["Robotics", "Biomimetics"],
    },
  ],
  awards: [
    "Best Paper Award at International Conference on Robotics 2022",
    "Outstanding Researcher Award from the International Society of Artificial Intelligence 2021",
  ],
};

export default function Profile() {
  // TODO: Replace with actual data fetching logic
  const personData: PersonFull = jsonDummyData;
  const listSections: PersonInfoItem[] = [
    { title: "Research Areas", items: personData.researchAreas },
    {
      title: "Teaching Assistants",
      items: personData.teachingAssistants.map(
        (assistant) => assistant.fullName,
      ),
    },
    { title: "Advisees", items: personData.advisees },
  ];

  const contactInfo = personData.contact;
  const contactItems: PersonInfoItem[] = [
    { title: "Email", value: contactInfo.email, icon: <Mail size={14} /> },
    { title: "Phone", value: contactInfo.phone, icon: <Phone size={14} /> },
    { title: "Office", value: contactInfo.labName, icon: <MapPin size={14} /> },
  ];

  const academicLinks = personData.academicLinks;
  const academicLinkItems: PersonInfoItem[] = [
    {
      title: "Sinta",
      value: academicLinks.sinta,
      icon: <GraduationCap size={14} />,
    },
    { title: "Scopus", value: academicLinks.scopus, icon: <Link2 size={14} /> },
    {
      title: "Google Scholar",
      value: academicLinks.scholar,
      icon: <Search size={14} />,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-white px-4 pb-16 pt-16 text-ink sm:px-6 lg:px-10">
      {/* PROFILE */}
      <div className="flex flex-col">
        {/* PROFILE HEAD*/}
        <div className="flex flex-col gap-8 bg-surface-strong lg:flex-row lg:items-stretch">
          {/* HEAD IMAGE */}
          <div className="relative h-56 w-full lg:h-auto lg:min-h-80 lg:w-72 lg:flex-none">
            <Image
              src={personData.profilePictureUrl ?? "/images/news-students.jpg"}
              alt={`${personData.fullName}'s profile picture`}
              fill
              sizes="(min-width: 1024px) 18rem, 100vw"
              className="object-cover"
            />
          </div>

          {/* HEAD BIO */}
          <div className="flex flex-1 flex-col justify-center gap-4 lg:px-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                {personData.fullName}
              </h1>
              <p className="text-lg text-muted">{personData.position}</p>
              <p className="text-sm font-medium text-muted">
                Supervisor{" "}
                {personData.isSupervisorAvailable
                  ? "Available"
                  : "Not Available"}
              </p>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-justify text-ink">
              {personData.shortBio}
            </p>

            <ul className="space-y-2 text-sm leading-6 list-none text-ink">
              {personData.degrees.map((degree) => (
                <li key={degree}>{degree}</li>
              ))}
            </ul>
          </div>

          {/* HEAD ACADEMIC INFO */}
          <div className="flex flex-col justify-center gap-6 p-6 lg:w-80 lg:flex-none">
            {listSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink">
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-1 text-sm leading-6 list-none text-ink">
                  {section.title === "Teaching Assistants"
                    ? personData.teachingAssistants.map((assistant) => (
                        <li key={assistant.fullName} className="mt-2">
                          <p className="font-medium">{assistant.fullName}</p>
                          <p className="text-xs leading-5">
                            {assistant.contact.email}
                          </p>
                          <p className="text-xs leading-5">
                            {assistant.contact.phone}
                          </p>
                        </li>
                      ))
                    : section.items?.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE BODY */}
        <div className="flex flex-col bg-surface lg:flex-row lg:items-stretch">
          {/* BODY SUMMARY & CONTACT */}
          <div className="flex min-h-56 flex-col bg-surface-strong p-4 lg:w-72 lg:flex-none">
            <div className="flex-1">
              {/* CONTACT INFO */}
              <ul className="text-sm text-ink">
                {contactItems.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[1.5rem_1fr] items-start gap-3"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-ink">
                      {item.icon}
                    </span>
                    <span className="font-medium text-justify">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
              {/* ACADEMIC LINKS */}
              <ul className="mt-3 text-sm text-ink">
                {academicLinkItems.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[1.5rem_1fr] items-start gap-3"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-ink">
                      {item.icon}
                    </span>
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-justify text-ink underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BODY LONG BIO*/}
          <div className="flex bg-white p-8 text-ink">
            <p className="text-justify leading-6 text-ink">
              {personData.longBio}
            </p>
          </div>
        </div>
      </div>
      {/* PUBLICATIONS */}
      <div className="bg-white py-8 text-ink">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Publications
        </h1>
        {personData.publications.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm leading-6 list-none">
            {personData.publications.map((publication) => (
              <li key={publication.title} className="pb-2">
                <a
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink underline decoration-ink/40 underline-offset-2"
                >
                  {publication.title}
                </a>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-muted">
                  <span>{publication.date}</span>
                  <span aria-hidden="true">•</span>
                  <span>{publication.type}</span>
                  <span aria-hidden="true">•</span>
                  <span>{publication.peopleInvolved.join(", ")}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {publication.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded border border-ink/10 px-2 py-1 text-xs leading-none text-ink"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No publications found.</p>
        )}
      </div>
      {/* AWARDS */}
      <div className="py-8 text-ink">
        <h1 className="text-2xl font-semibold tracking-tight">
          Awards & Honors
        </h1>
        {personData.awards.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm leading-6 list-none">
            {personData.awards.map((award) => (
              <li key={award} className="pb-2">
                <p className="font-medium text-ink">{award}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No awards found.</p>
        )}
      </div>
    </main>
  );
}

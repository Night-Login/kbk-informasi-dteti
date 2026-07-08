import type { PersonFull } from "@/types/person";

type ListSection = {
  title: string;
  items: string[];
};

type ContactItem = {
  label: string;
  value: string;
  icon: string;
};

const dummyPerson: PersonFull = {
  id: "leonardo-da-vinci",
  fullName: "Prof. Leonardo da Vinci, S.Kom., M.Cs., Ph.D.",
  position: "Professor of Artificial Intelligence & Robotics",
  isSupervisorAvailable: true,
  profilePictureUrl:
    "https://upload.wikimedia.org/wikipedia/commons/0/0c/Leonardo-da-vinci-posible-autorretrato-del-artista-galeria-de-los-uffizi-florencia_1c92d9d7_2.png",
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
  teachingAssistants: ["Gian Giacomo Caprotti", "Francesco Melzi"],
  advisees: ["Niccolò Machiavelli", "Ludovico Sforza", "Cesare Borgia"],
  academicLinks: {
    sinta: "https://sinta.kemdikbud.go.id/authors/profile/1452",
    scopus: "https://www.scopus.com/authid/detail.uri?authorId=1452",
    scholar: "https://scholar.google.com/citations?user=1452",
  },
};

export default async function PeopleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  const personData = dummyPerson;

  const listSections: ListSection[] = [
    { title: "Research Areas", items: personData.researchAreas },
    { title: "Teaching Assistants", items: personData.teachingAssistants },
    { title: "Advisees", items: personData.advisees },
  ];

  const contactItems: ContactItem[] = [
    { label: "Email", value: personData.contact.email, icon: "E" },
    { label: "Phone", value: personData.contact.phone, icon: "P" },
    { label: "Office", value: personData.contact.labName, icon: "O" },
  ];

  const academicLinkItems: ContactItem[] = [
    { label: "Sinta", value: personData.academicLinks.sinta, icon: "S" },
    { label: "Scopus", value: personData.academicLinks.scopus, icon: "SC" },
    {
      label: "Google Scholar",
      value: personData.academicLinks.scholar,
      icon: "GS",
    },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-white px-4 pb-16 pt-28 text-ink sm:px-6 lg:px-10">
      <div className="page-container">
        <section>
          <div className="flex flex-col gap-8 bg-surface-strong lg:flex-row lg:items-stretch">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personData.profilePictureUrl}
              alt={`${personData.fullName}'s profile picture`}
              className="h-56 w-full object-cover grayscale lg:h-auto lg:w-72 lg:flex-none"
            />

            <div className="flex flex-1 flex-col justify-center gap-4 px-6 pb-6 lg:px-2 lg:py-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {personData.fullName}
                </h1>
                <p className="text-lg">{personData.position}</p>
                <p className="text-sm font-medium">
                  Supervisor {personData.isSupervisorAvailable ? "Available" : "Not Available"}
                </p>
              </div>

              <p className="max-w-2xl text-justify text-sm leading-6">
                {personData.shortBio}
              </p>

              <ul className="space-y-2 text-sm leading-6">
                {personData.degrees.map((degree) => (
                  <li key={degree}>{degree}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center gap-6 bg-white/25 p-6 lg:w-80 lg:flex-none">
              {listSections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                    {section.title}
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col bg-surface-strong lg:flex-row lg:items-stretch">
            <div className="flex min-h-56 flex-col p-4 lg:w-72 lg:flex-none">
              <ul className="space-y-3 text-sm">
                {contactItems.map((item) => (
                  <li key={item.label} className="grid grid-cols-[1.5rem_1fr] items-start gap-3">
                    <span className="flex size-5 items-center justify-center rounded-full border border-ink/30 text-[0.6rem] font-semibold">
                      {item.icon}
                    </span>
                    <span className="break-words font-medium">{item.value}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 space-y-3 text-sm">
                {academicLinkItems.map((item) => (
                  <li key={item.label} className="grid grid-cols-[1.5rem_1fr] items-start gap-3">
                    <span className="flex size-5 items-center justify-center rounded-full border border-ink/30 text-[0.55rem] font-semibold">
                      {item.icon}
                    </span>
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 bg-white p-8">
              <p className="text-justify leading-7">{personData.longBio}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

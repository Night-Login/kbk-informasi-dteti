import { PersonFull } from "@/types/person";

type PersonInfoItem = {
  title: string;
  items?: string[];
  value?: string;
  icon?: string;
};

const jsonDummyData = {
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

export default function Profile({ params }: { params: { id: string } }) {
  const { id } = params;

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
    { title: "Email", value: contactInfo.email, icon: "E" },
    { title: "Phone", value: contactInfo.phone, icon: "P" },
    { title: "Office", value: contactInfo.labName, icon: "O" },
  ];

  const academicLinks = personData.academicLinks;
  const academicLinkItems: PersonInfoItem[] = [
    { title: "Sinta", value: academicLinks.sinta, icon: "S" },
    { title: "Scopus", value: academicLinks.scopus, icon: "SC" },
    { title: "Google Scholar", value: academicLinks.scholar, icon: "GS" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] px-4 py-8 text-primary-1000 sm:px-6 lg:px-10">
      {/* REMOVE TEMP CLASSES (Bg text) AFTER INTEGRATION */}

      {/* PROFILE */}
      <div className="flex flex-col">
        {/* PROFILE HEAD*/}
        <div className="flex flex-col gap-8 bg-primary-500 lg:flex-row lg:items-stretch">
          {/* HEAD IMAGE */}
          <img
            src={personData.profilePictureUrl}
            alt={`${personData.fullName}'s profile picture`}
            className="h-56 w-full object-cover lg:h-auto lg:w-72 lg:flex-none"
          />

          {/* HEAD BIO */}
          <div className="flex flex-1 flex-col justify-center gap-4 lg:px-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {personData.fullName}
              </h1>
              <p className="text-lg ">{personData.position}</p>
              <p className="text-sm font-medium">
                Supervisor{" "}
                {personData.isSupervisorAvailable
                  ? "Available"
                  : "Not Available"}
              </p>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-justify">
              {personData.shortBio}
            </p>

            <ul className="space-y-2 text-sm leading-6 list-none">
              {personData.degrees.map((degree) => (
                <li key={degree}>{degree}</li>
              ))}
            </ul>
          </div>

          {/* HEAD ACADEMIC INFO */}
          <div className="flex flex-col justify-center gap-6 bg-white/10 p-6 lg:w-80 lg:flex-none">
            {listSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
                  {section.title}
                </h2>
                <ul className="mt-3 space-y-1 text-sm leading-6 list-none">
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
        <div className="flex flex-col bg-primary-500 lg:flex-row lg:items-stretch">
          {/* BODY SUMMARY & CONTACT */}
          <div className="flex min-h-56 flex-col bg-primary-500 p-4 lg:w-72 lg:flex-none">
            <div className="flex-1">
              {/* CONTACT INFO */}
              <ul className="text-sm">
                {contactItems.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[1.5rem_1fr] items-start gap-3"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary-100/30 text-[0.65rem] font-semibold uppercase text-primary-100">
                      {item.icon}
                    </span>
                    <span className="font-medium text-justify">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
              {/* ACADEMIC LINKS */}
              <ul className="mt-3 text-sm">
                {academicLinkItems.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[1.5rem_1fr] items-start gap-3"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary-100/30 text-[0.65rem] font-semibold uppercase text-primary-100">
                      {item.icon}
                    </span>
                    <a
                      href={item.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-justify text-primary-1000 underline"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BODY LONG BIO*/}
          <div className="flex bg-[#ffffff] p-8">
            <p className="text-justify leading-6">{personData.longBio}</p>
          </div>
        </div>
      </div>
      {/* PUBLICATIONS */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Publications</h1>
        {personData.publications.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm leading-6 list-none">
            {personData.publications.map((publication) => (
              <li key={publication.title} className="pb-2">
                <a
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-1000 underline decoration-primary-1000/40 underline-offset-2"
                >
                  {publication.title}
                </a>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-primary-800">
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
                      className="inline-flex items-center rounded border border-primary-1000 px-2 py-1 text-xs leading-none text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm ">No publications found.</p>
        )}
      </div>
      {/* AWARDS */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Awards & Honors</h1>
        {personData.awards.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm leading-6 list-none">
            {personData.awards.map((award) => (
              <li key={award} className="pb-2">
                <p className="font-medium text-primary-1000">{award}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm ">No awards found.</p>
        )}
      </div>
    </div>
  );
}

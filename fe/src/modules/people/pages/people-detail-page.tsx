import Breadcrumbs from "@/components/global/breadcrumbs";
import DataTable, {
  type DataTableColumn,
  type DataTableFilter,
  type DataTableRow,
} from "@/components/global/data-table";
import TopicTag from "@/components/global/topic-tag";
import type { PersonFull } from "@/types/person";
import { GraduationCap, Link2, Mail, MapPin, Search } from "lucide-react";
import Image from "next/image";

const personData: PersonFull = {
  id: "leonardo-da-vinci",
  fullName: "Prof. Leonardo da Vinci, S.Kom., M.Cs., Ph.D.",
  position: "Professor of Artificial Intelligence & Robotics",
  isSupervisorAvailable: true,
  profilePictureUrl: "/images/news-students.jpg",
  contact: {
    labName: "Intelligence Computation and Robotics Lab",
    email: "davinci.leo@ugm.ac.id",
  },
  shortBio:
    "An interdisciplinary researcher connecting intelligent systems, computer vision, and biomimetic robotics.",
  longBio:
    "Leonardo da Vinci is an interdisciplinary scientist and academic whose work connects classical mechanics with modern computing. His early studies focused on the foundations of information technology before expanding into intelligent mechanical systems and human-centered design.\n\nHis research explores how observations from nature can inform autonomous robotics, aerial systems, and computational models. This approach combines rigorous engineering methods with experimentation across computer vision and machine learning.\n\nAt Universitas Gadjah Mada, he leads collaborative projects on autonomous robotics and supports graduate researchers working across artificial intelligence, simulation, and computational geometry. He also contributes to multidisciplinary teaching and research partnerships.",
  degrees: [
    "Ph.D. in Computer Science, Massachusetts Institute of Technology",
    "M.Sc. in Mechano-Informatics, The University of Tokyo",
    "B.Eng. in Information Technology, Universitas Gadjah Mada",
  ],
  researchAreas: [
    "Artificial Intelligence",
    "Computer Vision",
    "Biomimetic Robotics",
  ],
  teachingAssistants: [
    {
      fullName: "Gian Giacomo Caprotti",
      contact: { email: "caprotti.gian@ugm.ac.id" },
    },
    {
      fullName: "Francesco Melzi",
      contact: { email: "melzi.francesco@ugm.ac.id" },
    },
  ],
  advisees: [
    {
      id: "advisee-1",
      fullName: "Nadia Prameswari",
      level: "S1",
      project: "Vision-Based Navigation for Indoor Mobile Robots",
      researchArea: "Computer Vision",
      profileHref: "/people/leonardo-da-vinci",
    },
    {
      id: "advisee-2",
      fullName: "Raka Mahendra",
      level: "S1",
      project: "Lightweight Object Detection for Edge Devices",
      researchArea: "Deep Learning",
      profileHref: "/people/leonardo-da-vinci",
    },
    {
      id: "advisee-3",
      fullName: "Alya Kusuma",
      level: "S2",
      project: "Human-Aware Motion Planning for Service Robots",
      researchArea: "Robotics",
      profileHref: "/people/leonardo-da-vinci",
    },
    {
      id: "advisee-4",
      fullName: "Dimas Wicaksono",
      level: "S2",
      project: "Generative Models for Anatomical Reconstruction",
      researchArea: "Generative AI",
      profileHref: "/people/leonardo-da-vinci",
    },
    {
      id: "advisee-5",
      fullName: "Sekar Ayuningtyas",
      level: "S3",
      project: "Bio-Inspired Control for Autonomous Aerial Systems",
      researchArea: "Biomimetic Robotics",
      profileHref: "/people/leonardo-da-vinci",
    },
  ],
  academicLinks: {
    sinta: "https://sinta.kemdikbud.go.id/authors/profile/1452",
    scopus: "https://www.scopus.com/authid/detail.uri?authorId=1452",
    scholar: "https://scholar.google.com/citations?user=1452",
  },
  publications: [
    {
      title:
        "A Vision-Based Framework for Biomimetic Autonomous Navigation",
      link: "/publication",
      type: "Journal",
      date: "07 July 2026",
      peopleInvolved: ["Leonardo da Vinci", "Nadia Prameswari"],
      tags: ["Artificial Intelligence", "Computer Vision"],
    },
    {
      title: "Human-Aware Motion Planning for Collaborative Service Robots",
      link: "/publication",
      type: "Conference",
      date: "15 August 2026",
      peopleInvolved: ["Leonardo da Vinci", "Alya Kusuma"],
      tags: ["Robotics", "Human-Centered Computing"],
    },
    {
      title: "Lightweight Neural Networks for Real-Time Edge Perception",
      link: "/publication",
      type: "Journal",
      date: "22 September 2026",
      peopleInvolved: ["Leonardo da Vinci", "Raka Mahendra"],
      tags: ["Deep Learning", "Edge AI"],
    },
  ],
  awards: [
    "Best Paper Award, International Conference on Robotics, 2026",
    "Outstanding Researcher Award, Faculty of Engineering, 2025",
    "UGM Interdisciplinary Research Grant, 2024",
    "Distinguished Academic Service Award, 2023",
  ],
};

const adviseeColumns: DataTableColumn[] = [
  { key: "no", label: "No", className: "w-16 text-center" },
  { key: "name", label: "Student Name", className: "min-w-48" },
  { key: "level", label: "Level", className: "w-24 text-center" },
  { key: "project", label: "Project", className: "min-w-80" },
  { key: "researchArea", label: "Research Areas", className: "min-w-40" },
];

const adviseeFilters: DataTableFilter[] = [
  { label: "Show All", value: "all" },
  { label: "Bachelor (S1)", value: "S1" },
  { label: "Master (S2)", value: "S2" },
  { label: "Doctor (S3)", value: "S3" },
];

export default function PeopleDetailPage() {
  const adviseeRows: DataTableRow[] = personData.advisees.map(
    (advisee, index) => ({
      id: advisee.id,
      filterValue: advisee.level,
      cells: {
        no: index + 1,
        name: advisee.fullName,
        level: advisee.level,
        project: advisee.project,
        researchArea: advisee.researchArea,
      },
      actionHref: advisee.profileHref,
    }),
  );

  const academicLinks = [
    {
      label: "SINTA",
      href: personData.academicLinks.sinta,
      icon: GraduationCap,
    },
    { label: "Scopus", href: personData.academicLinks.scopus, icon: Link2 },
    {
      label: "Google Scholar",
      href: personData.academicLinks.scholar,
      icon: Search,
    },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-white pb-20 pt-24 sm:pt-28">
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "People", href: "/people" },
            { label: personData.fullName },
          ]}
        />

        <section className="mt-6 overflow-hidden" aria-labelledby="profile-name">
          <div className="grid lg:grid-cols-[20rem_minmax(0,1fr)]">
            <div className="relative min-h-72 bg-surface-strong lg:min-h-[26rem]">
              <Image
                src={personData.profilePictureUrl ?? "/images/news-students.jpg"}
                alt={personData.fullName}
                fill
                sizes="(min-width: 1024px) 20rem, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="brand-gradient grid gap-10 p-6 text-white sm:p-10 xl:grid-cols-[minmax(0,1fr)_20rem] xl:p-12">
              <div>
                <h1
                  id="profile-name"
                  className="text-3xl font-bold leading-tight text-dteti-yellow sm:text-4xl"
                >
                  {personData.fullName}
                </h1>
                <p className="mt-2 text-lg font-semibold text-white">
                  {personData.position}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/85">
                  Supervisor: {personData.isSupervisorAvailable ? "Available" : "Unavailable"}
                </p>

                <p className="mt-6 max-w-3xl text-sm leading-6 text-white/90">
                  {personData.shortBio}
                </p>

                <ul className="mt-6 space-y-2 text-sm leading-6 text-white/90">
                  {personData.degrees.map((degree) => (
                    <li key={degree}>{degree}</li>
                  ))}
                </ul>
              </div>

              <aside className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-white">Research Areas</h2>
                  <ul className="mt-2 space-y-1 text-sm">
                    {personData.researchAreas.map((area) => (
                      <li key={area} className="font-semibold text-white underline underline-offset-2">
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">Teaching Assistants</h2>
                  <ul className="mt-2 space-y-3 text-sm">
                    {personData.teachingAssistants.map((assistant) => (
                      <li key={assistant.fullName}>
                        <p className="font-semibold text-white">{assistant.fullName}</p>
                        <a
                          href={`mailto:${assistant.contact.email}`}
                          className="mt-1 flex items-center gap-2 text-white/80 hover:text-white hover:underline"
                        >
                          <Mail size={14} aria-hidden="true" />
                          {assistant.contact.email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>

          <div className="grid lg:grid-cols-[20rem_minmax(0,1fr)]">
            <aside className="brand-gradient p-6 text-white">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                  <span>{personData.contact.labName}</span>
                </li>
                <li>
                  <a
                    href={`mailto:${personData.contact.email}`}
                    className="flex items-start gap-3 break-all hover:underline"
                  >
                    <Mail className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                    <span>{personData.contact.email}</span>
                  </a>
                </li>
                {academicLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Icon size={16} aria-hidden="true" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="space-y-6 p-6 text-sm leading-7 text-ink sm:p-10 lg:p-12">
              {personData.longBio.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="advisees-heading">
          <h2 id="advisees-heading" className="mb-5 text-2xl font-bold text-dteti-blue sm:text-3xl">
            Advisees
          </h2>
          <DataTable
            ariaLabel="Lecturer advisees"
            columns={adviseeColumns}
            rows={adviseeRows}
            filters={adviseeFilters}
            actionLabel="Action"
            searchPlaceholder="Search advisees"
            statusLabel="Supervisor status:"
            statusTone={personData.isSupervisorAvailable ? "available" : "unavailable"}
          />
        </section>

        <section className="mt-14" aria-labelledby="publications-heading">
          <h2 id="publications-heading" className="text-2xl font-bold text-dteti-blue sm:text-3xl">
            Publication
          </h2>
          <ul className="mt-6 divide-y divide-line">
            {personData.publications.map((publication) => (
              <li key={publication.title} className="py-5 first:pt-0">
                <a
                  href={publication.link}
                  className="text-lg font-bold text-ink hover:text-dteti-blue hover:underline"
                >
                  {publication.title}
                </a>
                <p className="mt-1 text-sm text-muted">
                  {publication.type} &bull; {publication.date} &bull; {publication.peopleInvolved.join(", ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {publication.tags.map((tag) => (
                    <TopicTag key={tag}>{tag}</TopicTag>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="awards-heading">
          <h2 id="awards-heading" className="text-2xl font-bold text-dteti-blue sm:text-3xl">
            Awards &amp; Honours
          </h2>
          <ul className="mt-6 space-y-4 text-base text-ink">
            {personData.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

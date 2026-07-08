import { PersonFull } from "@/types/person";

type ListSection = {
  title: string;
  items: string[];
};

const jsonDummyData = {
  id: "budi-santoso",
  fullName: "Dr. Budi Santoso, M.Sc.",
  position: "Associate Professor",
  isSupervisorAvailable: true,
  profilePictureUrl: "/placeholder.jpg",
  contact: {
    labName: "Lab XYZ",
    phone: "(+62)81234567890",
    email: "budi.santoso@mail.ugm.ac.id",
  },
  shortBio:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula malesuada ipsum, sit amet congue erat dapibus vel. Aliquam at porta arcu, sed tincidunt elit. Nullam velit neque, tempor sed consectetur at, molestie nec enim.",
  degrees: [
    "Gelar Ph.D. (Information Technology, Gadjah Mada University)",
    "Gelar M.Sc. (Computer Science, Gadjah Mada University)",
    "Gelar S.Kom. (Informatics, Gadjah Mada University)",
  ],
  researchAreas: [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
  ],
  teachingAssistants: ["Andi Saputra", "Rina Melati"],
  advisees: ["Reza Rahadian", "Chelsea Islan", "Iqbaal Ramadhan"],
  academicLinks: {
    sinta: "https://sinta.kemdikbud.go.id/authors/profile/12345",
    scopus: "https://www.scopus.com/authid/detail.uri?authorId=12345",
    scholar: "https://scholar.google.com/citations?user=12345",
  },
};

export default function Profile({ params }: { params: { id: string } }) {
  const { id } = params;

  // TODO: Replace with actual data fetching logic
  const personData: PersonFull = jsonDummyData;
  const listSections: ListSection[] = [
    { title: "Research Areas", items: personData.researchAreas },
    { title: "Teaching Assistants", items: personData.teachingAssistants },
    { title: "Advisees", items: personData.advisees },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#ffffff] px-4 py-8 text-primary-1000 sm:px-6 lg:px-10">
      {/* REMOVE TEMP CLASSES (Bg text) AFTER INTEGRATION */}

      {/* PROFILE */}
      <div className="flex flex-col gap-8">
        {/* PROFILE HEAD*/}
        <div className="flex flex-col gap-8 bg-primary-500 p-6 lg:flex-row lg:items-stretch lg:p-10">
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

            <p className="max-w-2xl text-sm leading-6 ">
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
                <ul className="mt-3 space-y-2 text-sm leading-6 list-none">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE BODY */}
        <div>
          {/* BODY SUMMARY */}

          {/* BODY CONTENT*/}
        </div>
      </div>
      {/* PUBLICATIONS */}
      <div></div>
      {/* Awards */}
      <div></div>
    </div>
  );
}

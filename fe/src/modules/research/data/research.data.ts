export const researchLandingCards = [
  {
    title: "Research Areas",
    description: "Discover research topics and find related lecturers and publications.",
    actionLabel: "Explore Research Areas",
    href: "/research-areas",
  },
  {
    title: "Research & Project",
    description: "Explore ongoing and completed research projects.",
    actionLabel: "View Projects",
    href: "/research#projects",
  },
] as const;

export const commonResearchTags = [
  "Machine Learning",
  "Deep Learning",
  "Data Mining",
  "Recommender System",
  "Business Intelligence",
  "NLP",
  "Computer Vision",
  "Signal Processing",
] as const;

export const researchAreas = [
  {
    title: "Intelligent Systems & Data",
    tags: commonResearchTags,
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Software, Data & Information Systems",
    tags: commonResearchTags,
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Networks, Security & Infrastructure",
    tags: commonResearchTags,
    lecturers: 12,
    publications: 48,
  },
  {
    title: "IoT, Smart Systems & Environment",
    tags: commonResearchTags,
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Human-Centered Computing & Education",
    tags: commonResearchTags,
    lecturers: 12,
    publications: 48,
  },
] as const;

export const tagResearchAreas = [
  {
    title: "Machine Learning",
    tags: [
      "Intelligent Systems & Data",
      "Software, Data & Information Systems",
      "Human-Centered Computing & Education",
    ],
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Computer Vision",
    tags: [
      "Intelligent Systems & Data",
      "IoT, Smart Systems & Environment",
      "Human-Centered Computing & Education",
    ],
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Cybersecurity",
    tags: [
      "Networks, Security & Infrastructure",
      "Software, Data & Information Systems",
    ],
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Data Mining",
    tags: [
      "Intelligent Systems & Data",
      "Software, Data & Information Systems",
      "IoT, Smart Systems & Environment",
    ],
    lecturers: 12,
    publications: 48,
  },
  {
    title: "Signal Processing",
    tags: [
      "Intelligent Systems & Data",
      "Networks, Security & Infrastructure",
      "IoT, Smart Systems & Environment",
    ],
    lecturers: 12,
    publications: 48,
  },
] as const;

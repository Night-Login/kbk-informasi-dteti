export const researchLandingCards = [
  {
    title: "Research Areas",
    description: "Discover research topics and find related lecturers and publications.",
    actionLabel: "Explore Research Areas",
    href: "/research-areas",
  },
  {
    title: "Project",
    description: "Explore ongoing and completed research projects.",
    actionLabel: "View Projects",
    href: "/projects",
  },
  {
    title: "Publication",
    description: "Browse research outputs from lecturers and research teams.",
    actionLabel: "View Publication",
    href: "/publication",
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

export const projectData = [
  {
    id: "generative-ai-learning-assistant",
    title: "Generative AI Learning Assistant for Higher Education",
    description:
      "Developing an adaptive learning assistant that supports responsible, contextual feedback for university students.",
    tags: ["Artificial Intelligence", "Generative AI"],
    people: ["Nadia Prameswari", "Raka Mahendra", "Alya Kusuma"],
    period: "2024 - Present",
    status: "Ongoing",
  },
  {
    id: "mobile-digital-education",
    title: "Mobile Learning Platform for Digital Education",
    description:
      "Building an interactive mobile learning platform with structured content, assessment, and gamification features.",
    tags: ["Mobile Development", "Digital Education"],
    people: ["Dimas Wicaksono", "Sekar Ayuningtyas", "Raka Mahendra"],
    period: "2023 - 2024",
    status: "Completed",
  },
  {
    id: "iot-energy-management",
    title: "IoT-Based Energy Management System",
    description:
      "Designing a monitoring and control system for energy consumption using connected sensors and edge devices.",
    tags: ["Internet of Things", "Smart Energy"],
    people: ["Alya Kusuma", "Nadia Prameswari", "Dimas Wicaksono"],
    period: "2024 - Present",
    status: "Ongoing",
  },
  {
    id: "ar-commerce-platform",
    title: "Augmented Reality Commerce Experience",
    description:
      "Combining online commerce with augmented reality to improve product visualization and purchase confidence.",
    tags: ["Augmented Reality", "E-Commerce"],
    people: ["Raka Mahendra", "Sekar Ayuningtyas"],
    period: "2022 - 2023",
    status: "Completed",
  },
  {
    id: "market-trend-prediction",
    title: "Large-Scale Data Analysis for Market Trend Prediction",
    description:
      "Applying large-scale analytics to identify market patterns and support explainable forecasting.",
    tags: ["Data Science", "Big Data"],
    people: ["Nadia Prameswari", "Dimas Wicaksono", "Alya Kusuma"],
    period: "2024 - 2025",
    status: "Planned",
  },
] as const;

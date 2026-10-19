import { PrismaClient, Status, Visibility } from "@prisma/client";

/**
 * Minimal dummy data orchestrator for KBK DTETI.
 * Ensures every public page and admin dashboard displays populated, coherent data
 * without duplicating existing data from CSV/SQL seeders.
 */
export async function seedMinimalDummyData(prisma: PrismaClient) {
  console.log("🚀 Running minimal dummy data orchestrator...");

  // ---------------------------------------------------------------------------
  // 1. RESEARCH CLUSTERS & TAGS
  // ---------------------------------------------------------------------------
  const clusterDefinitions = [
    {
      name: "Intelligent System and Data",
      slug: "intelligent-systems-data",
      description:
        "Advancing machine learning, data mining, computer vision, and artificial intelligence technologies for complex decision support and automated intelligence.",
      sort_order: 1,
      tags: [
        { name: "Machine Learning", slug: "machine-learning", description: "Algorithms that learn patterns from empirical data for prediction and intelligent classification." },
        { name: "Deep Learning", slug: "deep-learning", description: "Multi-layer neural network architectures for visual recognition, sequence processing, and representation learning." },
        { name: "Data Mining", slug: "data-mining", description: "Extracting actionable knowledge and patterns from large structured and unstructured datasets." },
        { name: "Computer Vision", slug: "computer-vision", description: "Visual data processing, object detection, scene analysis, and medical image understanding." },
        { name: "NLP", slug: "nlp", description: "Natural language processing, linguistic modelling, and conversational interfaces." },
        { name: "Artificial Intelligence", slug: "artificial-intelligence", description: "Autonomous cognitive systems, heuristics, and generalized intelligent decision frameworks." }
      ]
    },
    {
      name: "Networks, Security, and Infrastructure",
      slug: "networks-security-infrastructure",
      description:
        "Researching secure network architectures, cybersecurity, distributed systems, and modern digital forensics infrastructure.",
      sort_order: 2,
      tags: [
        { name: "Computer Networks", slug: "computer-networks", description: "Network protocols, switching architectures, software-defined networking, and performance optimization." },
        { name: "Cybersecurity", slug: "cybersecurity", description: "Threat mitigation, cryptography, vulnerability management, and zero-trust security postures." },
        { name: "Digital Forensics", slug: "digital-forensics", description: "Cyber incident investigation, forensic artifact analysis, and chain-of-custody evidence handling." },
        { name: "Blockchain", slug: "blockchain", description: "Decentralized ledgers, consensus protocols, and verifiable smart contract execution." }
      ]
    },
    {
      name: "IoT, Smart Systems, and Environment",
      slug: "iot-smartsystem-environtment",
      description:
        "Designing smart interconnected devices, context-aware sensor networks, environmental monitoring, and ambient intelligent systems.",
      sort_order: 3,
      tags: [
        { name: "IoT", slug: "iot", description: "Interconnected sensing and actuation systems enabling real-time telemetry and edge computing." },
        { name: "Smart City", slug: "smart-city", description: "Urban telemetry, automated traffic systems, and sustainable municipal infrastructure." },
        { name: "Context-Aware Computing", slug: "context-aware-computing", description: "Adaptive computing responsive to user activity, environmental status, and spatial context." },
        { name: "Automation", slug: "automation", description: "Industrial feedback control, robotic automation, and programmable telemetry pipelines." }
      ]
    },
    {
      name: "Software, Data, and Information Systems",
      slug: "software-data-informationsystem",
      description:
        "Developing robust software architectures, database systems, scalable web applications, and enterprise information systems.",
      sort_order: 4,
      tags: [
        { name: "Software Engineering", slug: "software-engineering", description: "Methodologies and design patterns for building maintainable, dependable software systems." },
        { name: "Website", slug: "website", description: "Modern web architecture, responsive client-server frameworks, and web performance engineering." },
        { name: "Mobile App", slug: "mobile-app", description: "Native and cross-platform mobile application engineering and mobile ecosystem integration." },
        { name: "Database", slug: "database", description: "Relational, columnar, and document store storage engines, indexing, and query optimization." }
      ]
    },
    {
      name: "Human-Centered Computing and Education",
      slug: "humancenteredcomputing-education",
      description:
        "Innovating user interfaces, human-computer interaction, immersive learning experiences, and educational technology.",
      sort_order: 5,
      tags: [
        { name: "Human-Computer Interaction", slug: "human-computer-interaction", description: "User-centered design paradigms, cognitive load optimization, and interaction ergonomics." },
        { name: "UI", slug: "ui", description: "Visual interface design, design systems, and responsive layout styling." },
        { name: "UX", slug: "ux", description: "Usability testing, user journey mapping, and experiential evaluation of computing systems." },
        { name: "E-Learning", slug: "e-learning", description: "Digital pedagogies, learning management systems, and interactive educational tooling." },
        { name: "Immersive Technology", slug: "immersive-technology", description: "Virtual and augmented reality interfaces for immersive training and simulation." }
      ]
    }
  ];

  for (const clusterDef of clusterDefinitions) {
    const cluster = await prisma.researchCluster.upsert({
      where: { slug: clusterDef.slug },
      update: {
        description: clusterDef.description,
        sort_order: clusterDef.sort_order,
      },
      create: {
        name: clusterDef.name,
        slug: clusterDef.slug,
        description: clusterDef.description,
        sort_order: clusterDef.sort_order,
      }
    });

    for (const tagDef of clusterDef.tags) {
      await prisma.researchTag.upsert({
        where: { slug: tagDef.slug },
        update: {
          description: tagDef.description,
          cluster_id: cluster.id,
          is_active: true,
        },
        create: {
          name: tagDef.name,
          slug: tagDef.slug,
          description: tagDef.description,
          cluster_id: cluster.id,
          is_active: true,
        }
      });
    }
  }
  console.log("✅ Ensured Research Clusters and Tags with descriptions.");

  // ---------------------------------------------------------------------------
  // 2. LECTURERS & FALLBACK PUBLICATIONS
  // ---------------------------------------------------------------------------
  let lecturerCount = await prisma.lecturer.count({ where: { deleted_at: null } });

  if (lecturerCount === 0) {
    console.log("ℹ️ No lecturers found; creating 2 minimal fallback lecturers...");
    const intelCluster = await prisma.researchCluster.findUnique({ where: { slug: "intelligent-systems-data" } });
    const softwareCluster = await prisma.researchCluster.findUnique({ where: { slug: "software-data-informationsystem" } });
    const mlTag = await prisma.researchTag.findUnique({ where: { slug: "machine-learning" } });
    const seTag = await prisma.researchTag.findUnique({ where: { slug: "software-engineering" } });

    const lec1 = await prisma.lecturer.create({
      data: {
        full_name: "Dr. Budi Santoso, S.T., M.Eng.",
        academic_title: "Associate Professor",
        slug: "budi-santoso",
        nip_or_staff_id: "198501012010121001",
        sinta_id: "5971234",
        email: "budi.santoso@ugm.ac.id",
        short_bio: "Researcher in Machine Learning, Computer Vision, and Intelligent Systems.",
        bio: "Dr. Budi Santoso is an Associate Professor at the Department of Electrical Engineering and Information Technology (DTETI), Universitas Gadjah Mada. His research focuses on artificial intelligence, pattern recognition, and applied deep learning in healthcare and industrial automation.",
        supervision_status: "OPEN",
        is_active: true,
        photo_url: null,
        primary_research_cluster_id: intelCluster?.id,
        metrics: {
          create: {
            h_index: 14,
            total_citations: 480,
            source: "OPENALEX"
          }
        },
        research_tags: mlTag ? {
          create: {
            tag_id: mlTag.id,
            is_primary: true
          }
        } : undefined
      }
    });

    const lec2 = await prisma.lecturer.create({
      data: {
        full_name: "Dr. Siti Aminah, S.Kom., M.Cs.",
        academic_title: "Assistant Professor",
        slug: "siti-aminah",
        nip_or_staff_id: "198803152014042002",
        sinta_id: "5975678",
        email: "siti.aminah@ugm.ac.id",
        short_bio: "Expert in Software Engineering, Information Systems, and Human-Computer Interaction.",
        bio: "Dr. Siti Aminah is an Assistant Professor at DTETI UGM. She investigates human-computer interaction, accessible web technologies, and software quality assurance.",
        supervision_status: "OPEN",
        is_active: true,
        photo_url: null,
        primary_research_cluster_id: softwareCluster?.id,
        metrics: {
          create: {
            h_index: 9,
            total_citations: 230,
            source: "OPENALEX"
          }
        },
        research_tags: seTag ? {
          create: {
            tag_id: seTag.id,
            is_primary: true
          }
        } : undefined
      }
    });

    // Fallback Publications
    const pub1 = await prisma.publication.create({
      data: {
        title: "Deep Neural Networks for Automated Anomaly Detection in Critical Infrastructure",
        slug: "deep-neural-networks-anomaly-detection-critical-infrastructure",
        year: 2025,
        publication_date: "2025-06-15",
        authors_text: "Budi Santoso, Siti Aminah",
        venue: "IEEE Transactions on Industrial Informatics",
        publication_type: "JOURNAL",
        doi: "10.1109/TII.2025.1001",
        url: "https://doi.org/10.1109/TII.2025.1001",
        abstract: "This paper proposes a novel deep learning framework for real-time anomaly detection in distributed sensor networks.",
        citation_count: 14,
        verified_status: "VERIFIED",
        lecturers: {
          create: [
            { lecturer_id: lec1.id, author_order: 1 },
            { lecturer_id: lec2.id, author_order: 2 }
          ]
        }
      }
    });

    const pub2 = await prisma.publication.create({
      data: {
        title: "Human-Centered Interface Design Patterns for Accessible E-Learning Platforms",
        slug: "human-centered-interface-design-accessible-elearning",
        year: 2024,
        publication_date: "2024-11-20",
        authors_text: "Siti Aminah, Budi Santoso",
        venue: "ACM Conference on Human Factors in Computing Systems (CHI)",
        publication_type: "CONFERENCE",
        doi: "10.1145/chi.2024.2002",
        url: "https://doi.org/10.1145/chi.2024.2002",
        abstract: "An empirical investigation into inclusive interaction models for higher education digital platforms.",
        citation_count: 8,
        verified_status: "VERIFIED",
        lecturers: {
          create: [
            { lecturer_id: lec2.id, author_order: 1 },
            { lecturer_id: lec1.id, author_order: 2 }
          ]
        }
      }
    });

    console.log("✅ Created fallback Lecturers and Publications.");
  } else {
    // Enrich existing lecturers where fields were left null by CSV import
    const lecturersToEnrich = await prisma.lecturer.findMany({
      where: {
        deleted_at: null,
        OR: [
          { supervision_status: null },
          { email: null },
          { short_bio: null },
          { bio: null },
        ]
      },
      select: { id: true, slug: true, email: true, supervision_status: true, short_bio: true, bio: true }
    });

    for (const lec of lecturersToEnrich) {
      await prisma.lecturer.update({
        where: { id: lec.id },
        data: {
          supervision_status: lec.supervision_status || "OPEN",
          email: lec.email || `${lec.slug.replace(/[^a-z0-9]/g, "")}@ugm.ac.id`,
          short_bio: lec.short_bio || "Lecturer and researcher in Information Technology at DTETI FT UGM.",
          bio: lec.bio || "Faculty member and researcher at the Department of Electrical Engineering and Information Technology (DTETI), Faculty of Engineering, Universitas Gadjah Mada.",
        }
      });
    }
    console.log(`✅ Enriched ${lecturersToEnrich.length} existing lecturers with supervision status, email, and biography.`);
  }

  // ---------------------------------------------------------------------------
  // 3. LECTURER EDUCATION HISTORY
  // ---------------------------------------------------------------------------
  const educationCount = await prisma.lecturerEducation.count();
  if (educationCount === 0) {
    const activeLecturers = await prisma.lecturer.findMany({
      where: { deleted_at: null },
      take: 20,
      select: { id: true, full_name: true }
    });

    for (const lec of activeLecturers) {
      await prisma.lecturerEducation.createMany({
        data: [
          {
            lecturer_id: lec.id,
            degree: "S.T.",
            institution: "Universitas Gadjah Mada",
            field: "Teknik Elektro dan Teknologi Informasi",
            year: "2010"
          },
          {
            lecturer_id: lec.id,
            degree: "M.Eng.",
            institution: "Tokyo Institute of Technology",
            field: "Information and Communications Engineering",
            year: "2014"
          },
          {
            lecturer_id: lec.id,
            degree: "Ph.D.",
            institution: "Nanyang Technological University",
            field: "Computer Science and Engineering",
            year: "2019"
          }
        ]
      });
    }
    console.log(`✅ Seeded sample education history for ${activeLecturers.length} lecturers.`);
  }

  // ---------------------------------------------------------------------------
  // 4. PROJECTS (RESEARCH TAB & PROJECTS PAGE)
  // ---------------------------------------------------------------------------
  const projectCount = await prisma.project.count({ where: { deleted_at: null } });
  if (projectCount === 0) {
    const lecturers = await prisma.lecturer.findMany({
      where: { deleted_at: null },
      take: 3,
      select: { id: true }
    });
    const tags = await prisma.researchTag.findMany({
      where: { deleted_at: null, is_active: true },
      take: 4,
      select: { id: true }
    });

    const leadLecturer1 = lecturers[0]?.id;
    const leadLecturer2 = lecturers[1]?.id || lecturers[0]?.id;

    // Ongoing Project
    const proj1 = await prisma.project.create({
      data: {
        title: "Smart Campus Environmental Monitoring & AI Analytics",
        slug: "smart-campus-environmental-monitoring-ai-analytics",
        description:
          "Development of an IoT-enabled air quality and energy consumption monitoring system across DTETI campus facilities, with predictive maintenance driven by deep learning models.",
        status: Status.ONGOING,
        start_year: 2025,
        end_year: 2027,
        partner_names: "PT Telkom Indonesia, Dinas Lingkungan Hidup DIY",
        funding_source: "Hibah Riset Kolaboratif Terapan UGM 2025",
        visibility: Visibility.PUBLIC,
        lead_lecturer_id: leadLecturer1,
        research_tags: tags[0] ? {
          create: [
            { tag_id: tags[0].id },
            ...(tags[1] ? [{ tag_id: tags[1].id }] : [])
          ]
        } : undefined,
        participants: leadLecturer2 && leadLecturer2 !== leadLecturer1 ? {
          create: [
            { lecturer_id: leadLecturer2, role: "Co-Investigator" }
          ]
        } : undefined
      }
    });

    // Completed Project
    const proj2 = await prisma.project.create({
      data: {
        title: "Next-Generation Digital Forensics and Secure Telemetry Platform",
        slug: "next-gen-digital-forensics-secure-telemetry",
        description:
          "Investigation and implementation of zero-trust verification architecture and automated incident analysis for critical educational and healthcare networks.",
        status: Status.COMPLETED,
        start_year: 2023,
        end_year: 2024,
        partner_names: "BSSN, Kementerian Komdigi",
        funding_source: "BOPTN Kemendikbudristek",
        visibility: Visibility.PUBLIC,
        lead_lecturer_id: leadLecturer2,
        research_tags: tags[2] ? {
          create: [
            { tag_id: tags[2].id },
            ...(tags[3] ? [{ tag_id: tags[3].id }] : [])
          ]
        } : undefined,
        participants: leadLecturer1 ? {
          create: [
            { lecturer_id: leadLecturer1, role: "Principal Researcher" }
          ]
        } : undefined
      }
    });

    console.log("✅ Created 2 minimal Projects with tags and lecturer participants.");
  }

  // ---------------------------------------------------------------------------
  // 5. NEWS ARTICLES (HOMEPAGE TABS, NEWS ARCHIVE, NEWS DETAIL)
  // ---------------------------------------------------------------------------
  const newsCount = await prisma.newsArticle.count();
  if (newsCount === 0) {
    await prisma.newsArticle.createMany({
      data: [
        {
          title: "DTETI Researchers Unveil Adaptive AI Framework for Smart Cities",
          slug: "dteti-researchers-adaptive-ai-smart-cities",
          excerpt:
            "The Intelligent Systems research group at DTETI FT UGM has developed an edge-computing framework enabling resilient traffic optimization.",
          body:
            "Researchers from the Department of Electrical Engineering and Information Technology (DTETI), Faculty of Engineering, Universitas Gadjah Mada, have announced breakthrough findings in edge AI for urban traffic optimization.\n\nThe system combines low-power camera feeds with decentralized deep learning models to predict traffic bottlenecks without transmitting private video streams to central servers, preserving citizen privacy while drastically reducing latency.\n\nThe project was conducted in collaboration with national research partners and tested across multiple intersections in the Special Region of Yogyakarta.",
          image_url: "/images/news-chip.jpg",
          published_at: new Date("2026-09-20T10:00:00.000Z"),
          is_published: true
        },
        {
          title: "DTETI Graduate Students Win International Cyber Defense Hackathon",
          slug: "dteti-graduate-students-cyber-defense-hackathon",
          excerpt:
            "A team of Master's and Doctoral students under the Networks and Infrastructure cluster secured first place at the ASEAN Cyber Defense Challenge.",
          body:
            "A delegation of graduate researchers from the Networks, Security, and Infrastructure research cluster at DTETI UGM took top honors at the ASEAN Cyber Defense Challenge held in Singapore.\n\nThe team showcased an automated vulnerability response pipeline capable of mitigating novel zero-day attacks in real-time industrial control networks.\n\nThis achievement underscores DTETI's continued commitment to excellence in high-impact technological education and applied cybersecurity research.",
          image_url: "/images/news-network.jpg",
          published_at: new Date("2026-10-05T14:30:00.000Z"),
          is_published: true
        }
      ]
    });
    console.log("✅ Created 2 published NewsArticles for homepage and news pages.");
  }

  // ---------------------------------------------------------------------------
  // 6. EVENTS (HOMEPAGE EVENTS TAB & EVENTS ARCHIVE / CALENDAR)
  // ---------------------------------------------------------------------------
  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "DTETI International Research Colloquium 2026: Advances in Autonomous Systems",
          slug: "dteti-research-colloquium-2026-autonomous-systems",
          description:
            "Join leading academic and industry keynote speakers discussing foundation models, robotics, and safety-critical computing.",
          starts_at: new Date("2026-11-20T09:00:00.000Z"),
          ends_at: new Date("2026-11-20T16:00:00.000Z"),
          location: "Multimedia Room, 3rd Floor, DTETI FT UGM, Jl. Grafika No. 2 Yogyakarta",
          link_url: "https://jteti.ugm.ac.id",
          image_url: "/images/news-students.jpg",
          is_published: true
        },
        {
          title: "Hands-on Workshop: Deep Learning for Scientific Computing",
          slug: "workshop-deep-learning-scientific-computing",
          description:
            "Intensive training session for graduate scholars and research assistants on accelerated tensor computing and model evaluation.",
          starts_at: new Date("2026-08-12T08:30:00.000Z"),
          ends_at: new Date("2026-08-12T15:30:00.000Z"),
          location: "Computer Laboratory 2, DTETI FT UGM",
          link_url: "https://jteti.ugm.ac.id",
          image_url: "/images/news-chip.jpg",
          is_published: true
        }
      ]
    });
    console.log("✅ Created 2 Events (1 upcoming, 1 past) for homepage and event calendar.");
  }

  // ---------------------------------------------------------------------------
  // 7. FALLBACK CONTENT (ACADEMIC PROGRAMS, SCHOLARSHIPS, SITE SETTINGS)
  // ---------------------------------------------------------------------------
  const siteSettingsCount = await prisma.siteSetting.count();
  if (siteSettingsCount === 0) {
    await prisma.siteSetting.createMany({
      data: [
        { key: "home_hero_title", label: "Homepage hero title", value: "Profil Kelompok Keahlian DTETI", field_type: "TEXT", sort_order: 10 },
        { key: "home_hero_description", label: "Homepage hero description", value: "Website ini merupakan platform profil resmi Kelompok Keahlian DTETI yang berfungsi sebagai pusat informasi dosen, bidang riset, publikasi, proyek, kegiatan akademik, dan peluang kolaborasi.", field_type: "MULTILINE", sort_order: 20 },
        { key: "home_hero_image", label: "Homepage hero image", value: "/images/hero-campus.jpg", field_type: "IMAGE", sort_order: 30 },
        { key: "graduate_website_url", label: "DTETI graduate program website", value: "https://pasca.jteti.ugm.ac.id/", field_type: "URL", sort_order: 40 },
        { key: "news_archive_url", label: "News archive link", value: "/news", field_type: "URL", sort_order: 50 },
        { key: "events_archive_url", label: "Events archive link", value: "/events", field_type: "URL", sort_order: 60 },
        { key: "footer_about", label: "Footer about description", value: "Kelompok Keahlian Teknik Informasi DTETI UGM mengembangkan penelitian, pendidikan, dan kolaborasi di bidang sistem cerdas, data, jaringan, serta teknologi informasi.", field_type: "MULTILINE", sort_order: 70 },
        { key: "contact_email", label: "Institutional contact email", value: "teti@ugm.ac.id", field_type: "TEXT", sort_order: 80 },
        { key: "contact_address", label: "Institutional contact address", value: "Jl. Grafika No. 2, Kampus UGM, Yogyakarta 55281", field_type: "MULTILINE", sort_order: 90 },
        { key: "social_instagram_url", label: "Instagram profile URL", value: "https://www.instagram.com/dtetiugm/", field_type: "URL", sort_order: 100 },
        { key: "social_youtube_url", label: "YouTube profile URL", value: "https://youtube.com", field_type: "URL", sort_order: 110 },
        { key: "social_facebook_url", label: "Facebook profile URL", value: "https://web.facebook.com/DTETIFTUGM", field_type: "URL", sort_order: 120 }
      ],
      skipDuplicates: true
    });
    console.log("✅ Seeded fallback Site Settings.");
  }

  const programCount = await prisma.academicProgram.count();
  if (programCount === 0) {
    await prisma.academicProgram.createMany({
      data: [
        {
          title: "Master’s Program (S2)",
          overview: "Advance your expertise through the DTETI Information Technology master’s program.",
          information: "Explore the curriculum, research concentrations, admission requirements, and graduate opportunities.",
          link_url: "https://pasca.jteti.ugm.ac.id/2022/10/12/program-studi-magister-teknologi-informasi/",
          sort_order: 10,
          is_published: true
        },
        {
          title: "Doctoral Program (S3)",
          overview: "Develop original research in electrical engineering and information technology.",
          information: "Learn about doctoral research, academic supervision, admission, and graduate outcomes.",
          link_url: "https://pasca.jteti.ugm.ac.id/2022/05/21/program-doktor-departemen-teknik-elektro-dan-teknologi-informasi/",
          sort_order: 20,
          is_published: true
        }
      ]
    });
    console.log("✅ Seeded fallback Academic Programs.");
  }

  const scholarshipCount = await prisma.scholarship.count();
  if (scholarshipCount === 0) {
    await prisma.scholarship.createMany({
      data: [
        {
          title: "Master’s Scholarships",
          overview: "Funding opportunities for prospective DTETI master’s students.",
          information: "Review current scholarship announcements, eligibility requirements, and application schedules.",
          link_url: "https://pasca.jteti.ugm.ac.id/beasiswa-dalam-negeri/",
          sort_order: 10,
          is_published: true
        },
        {
          title: "Doctoral Scholarships",
          overview: "Funding opportunities for prospective DTETI doctoral researchers.",
          information: "Find the latest doctoral scholarships and graduate funding information from DTETI UGM.",
          link_url: "https://pasca.jteti.ugm.ac.id/beasiswa-dalam-negeri/",
          sort_order: 20,
          is_published: true
        }
      ]
    });
    console.log("✅ Seeded fallback Scholarships.");
  }

  console.log("🎉 Minimal dummy data orchestration completed successfully!");
}


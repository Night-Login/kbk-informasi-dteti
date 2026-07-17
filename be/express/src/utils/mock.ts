import { Publication, Lecturer, Project } from "../types/index.js";

export const mockPublications: Publication[] = [
    {
        id: "pub-1",
        title: "Deep Learning for Automated Medical Image Analysis",
        slug: "deep-learning-automated-medical-image-analysis",
        year: 2025,
        authors_text: "Budi Santoso, Siti Aminah",
        venue: "IEEE Transactions",
        publication_type: "JOURNAL",
        source: "CSV_IMPORT",
        verified_status: "VERIFIED",
        url: "https://doi.org/10.dummy",
        tags: [{ name: "Machine Learning" }]
    }
];

export const mockLecturers: Lecturer[] = [
    {
        id: "a1b2c3d4",
        full_name: "Prof. Dr. Eng. Budi Santoso",
        academic_title: "Prof. Dr. Eng.",
        slug: "budi-santoso",
        nip_or_staff_id: "198001012005011001",
        email: "budi.santoso@ugm.ac.id",
        photo_url: "https://dummyimage.com/400x400/ccc/000.jpg&text=Budi+Santoso",
        bio: "Pakar di bidang Sistem Cerdas.",
        sinta_id: "6001234",
        supervision_status: "OPEN", 
        is_active: true,
        research_tags: [{ id: "tag-1", name: "Machine Learning", slug: "machine-learning" }]
    }
];

export const mockProjects: Project[] = [
    {
        id: "proj-1",
        title: "AI in Healthcare",
        slug: "ai-healthcare",
        description: "Research project on applying AI in healthcare settings.",
        start_date: "2023-01-01",
        end_date: "2024-01-01",
        status: "ACTIVE",
        lead_lecturer_id: "a1b2c3d4",
        participants: ["a1b2c3d4"]
    }
];

export interface ResearchTag {
    id?: string;
    name: string;
    slug?: string;
}

export interface Publication {
    id: string;
    title: string;
    slug: string;
    year: number;
    authors_text: string;
    venue: string;
    publication_type: string;
    source: string;
    verified_status: string;
    url?: string;
    tags?: Array<{ name: string }>;
    [key: string]: any;
}

export interface Lecturer {
    id: string;
    full_name: string;
    academic_title?: string;
    slug: string;
    nip_or_staff_id?: string;
    email?: string;
    photo_url?: string;
    bio?: string;
    sinta_id?: string;
    supervision_status?: string;
    is_active?: boolean;
    research_tags?: Array<ResearchTag>;
    [key: string]: any;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    lead_lecturer_id?: string;
    participants?: string[];
    [key: string]: any;
}

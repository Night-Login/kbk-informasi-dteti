import type { PaginationParams } from "./common.js";
import type { LecturerResearchTag, ResearchTag } from "./research.js";
import type { Publication } from "./publication.js";

export interface LecturerMetric {
    lecturer_id?: string;
    h_index?: number;
    total_citations?: number;
    sinta_score?: number | null;
    source?: string | null;
    fetched_at?: Date | string;
    [key: string]: any;
}

export interface LecturerPublication {
    lecturer_id: string;
    publication_id: string;
    author_order?: number | null;
    lecturer?: Lecturer;
    publication?: Publication;
}

export interface Lecturer {
    id: string;
    full_name: string;
    academic_title?: string | null;
    slug: string;
    nip_or_staff_id?: string;
    email?: string | null;
    photo_url?: string;
    bio?: string;
    sinta_id?: string | null;
    scopus_author_id?: string | null;
    google_scholar_url?: string | null;
    google_scholar_id?: string | null;
    orcid_id?: string | null;
    openalex_author_id?: string | null;
    semantic_scholar_id?: string | null;
    supervision_status?: string | null;
    is_active?: boolean;
    source_csv_row_ref?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string | null;
    metrics?: LecturerMetric | null;
    publications?: LecturerPublication[] | any[];
    research_tags?: LecturerResearchTag[] | ResearchTag[] | any[];
    education?: LecturerEducation[];
    awards?: LecturerAward[];
    supervised_students?: SupervisedStudent[];
    teaching_assistants?: TeachingAssistant[];
    [key: string]: any;
}

export interface LecturerFilters extends PaginationParams {
    search?: string;
    tag_id?: string;
    tag_slug?: string;
    cluster_id?: string;
    cluster_slug?: string;
    supervision_status?: string;
    is_active?: boolean;
    sinta_id?: string;
}

export interface LecturerEducation {
    id?: string;
    lecturer_id?: string;
    degree: string;
    institution: string;
    field?: string | null;
    year?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface LecturerAward {
    id?: string;
    lecturer_id?: string;
    name: string;
    institution?: string | null;
    year?: string | null;
    description?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface SupervisedStudent {
    id?: string;
    lecturer_id?: string;
    student_name: string;
    student_id_number?: string | null;
    program_level?: string | null;
    thesis_title?: string | null;
    supervision_role?: string | null;
    status?: string | null;
    start_date?: Date | string | null;
    end_date?: Date | string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface TeachingAssistant {
    id?: string;
    lecturer_id?: string;
    student_name: string;
    student_id_number?: string | null;
    course_name?: string | null;
    academic_period?: string | null;
    status?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
}

// Data Transfer Objects (DTOs) for creating/updating
export interface CreateLecturerDTO {
    full_name: string;
    academic_title?: string | null;
    slug: string;
    nip_or_staff_id: string;
    email?: string | null;
    photo_url?: string | null;
    short_bio?: string | null;
    bio?: string | null;
    sinta_id: string;
    scopus_author_id?: string | null;
    google_scholar_url?: string | null;
    google_scholar_id?: string | null;
    orcid_id?: string | null;
    openalex_author_id?: string | null;
    semantic_scholar_id?: string | null;
    supervision_status?: string | null;
    is_active?: boolean;
    source_csv_row_ref?: string | null;
    metrics?: LecturerMetric;
    tag_ids?: string[];
    education?: LecturerEducation[];
    awards?: LecturerAward[];
    supervised_students?: SupervisedStudent[];
    teaching_assistants?: TeachingAssistant[];
}

export interface UpdateLecturerDTO extends Partial<CreateLecturerDTO> {}

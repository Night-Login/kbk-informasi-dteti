export type Role = "SUPERADMIN" | "ADMIN";

export interface Admin {
    id?: number;
    username: string;
    password?: string;
    role?: Role;
    createdAt?: Date | string;
}

export interface ResearchCluster {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    sort_order?: number | null;
    tags?: ResearchTag[];
    [key: string]: any;
}

export interface ResearchTag {
    id?: string;
    name: string;
    slug?: string;
    cluster_id?: string;
    description?: string | null;
    is_active?: boolean;
    cluster?: ResearchCluster;
    lecturers?: LecturerResearchTag[];
    [key: string]: any;
}

export interface LecturerResearchTag {
    lecturer_id: string;
    tag_id: string;
    is_primary?: boolean;
    lecturer?: Lecturer;
    tag?: ResearchTag;
}

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
    metrics?: LecturerMetric | null;
    publications?: LecturerPublication[] | any[];
    research_tags?: LecturerResearchTag[] | ResearchTag[] | any[];
    [key: string]: any;
}

export interface Publication {
    id: string;
    title: string;
    slug: string;
    year: number;
    publication_date?: string | null;
    authors_text?: string | null;
    venue?: string | null;
    publication_type?: string | null;
    doi?: string | null;
    url?: string | null;
    abstract?: string | null;
    citation_count?: number;
    source?: string;
    external_ids?: any | null;
    verified_status?: string;
    fetch_batch_id?: string | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    lecturers?: LecturerPublication[] | any[];
    tags?: Array<{ name: string }>;
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

// Common pagination and filtering interfaces
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
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

export interface PublicationFilters extends PaginationParams {
    search?: string;
    year?: number;
    min_year?: number;
    max_year?: number;
    venue?: string;
    publication_type?: string;
    source?: string;
    verified_status?: string;
    lecturer_id?: string;
    lecturer_slug?: string;
    tag_id?: string;
}

export interface ResearchTagFilters extends PaginationParams {
    search?: string;
    cluster_id?: string;
    cluster_slug?: string;
    is_active?: boolean;
}

export interface ResearchClusterFilters extends PaginationParams {
    search?: string;
    include_tags?: boolean;
    include_lecturers?: boolean;
}

// Data Transfer Objects (DTOs) for creating/updating
export interface CreateLecturerDTO {
    full_name: string;
    academic_title?: string | null;
    slug: string;
    nip_or_staff_id: string;
    email?: string | null;
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
}

export interface UpdateLecturerDTO extends Partial<CreateLecturerDTO> {}

export interface CreatePublicationDTO {
    title: string;
    slug: string;
    year: number;
    publication_date?: string | null;
    authors_text?: string | null;
    venue?: string | null;
    publication_type?: string | null;
    doi?: string | null;
    url?: string | null;
    abstract?: string | null;
    citation_count?: number;
    source?: string;
    external_ids?: any | null;
    verified_status?: string;
    fetch_batch_id?: string | null;
    lecturers?: Array<{ lecturer_id: string; author_order?: number }>;
}

export interface UpdatePublicationDTO extends Partial<CreatePublicationDTO> {}

export interface CreateResearchClusterDTO {
    name: string;
    slug: string;
    description?: string | null;
    sort_order?: number | null;
}

export interface UpdateResearchClusterDTO extends Partial<CreateResearchClusterDTO> {}

export interface CreateResearchTagDTO {
    name: string;
    slug: string;
    cluster_id: string;
    description?: string | null;
    is_active?: boolean;
}

export interface UpdateResearchTagDTO extends Partial<CreateResearchTagDTO> {}

export interface CreateAdminDTO {
    username: string;
    password?: string;
    role?: Role;
}

export interface UpdateAdminDTO extends Partial<CreateAdminDTO> {}

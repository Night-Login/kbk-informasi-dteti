import type { PaginationParams } from "./common.js";
import type { LecturerPublication } from "./lecturer.js";

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

// Data Transfer Objects (DTOs) for creating/updating
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

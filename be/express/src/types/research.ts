import type { PaginationParams } from "./common.js";
import type { Lecturer } from "./lecturer.js";

export interface ResearchCluster {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    sort_order?: number | null;
    deleted_at?: Date | string | null;
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
    deleted_at?: Date | string | null;
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

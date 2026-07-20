import type { PaginationParams } from "./common.js";
import type { Lecturer } from "./lecturer.js";
import type { ResearchTag } from "./research.js";

export interface ProjectResearchTag {
    project_id: string;
    tag_id: string;
    project?: Project;
    tag?: ResearchTag;
}

export interface LecturerProject {
    project_id: string;
    lecturer_id: string;
    role?: string | null;
    project?: Project;
    lecturer?: Lecturer;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    status?: string; // "PLANNED" | "ONGOING" | "COMPLETED"
    start_year?: number | null;
    end_year?: number | null;
    start_date?: string | null; // For backward compatibility
    end_date?: string | null;
    partner_names?: string | null;
    funding_source?: string | null;
    visibility?: string | null; // "PUBLIC" | "INTERNAL" | "HIDDEN"
    lead_lecturer_id?: string | null;
    lead_lecturer?: Lecturer | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string | null;
    research_tags?: ProjectResearchTag[] | ResearchTag[] | any[];
    participants?: LecturerProject[] | string[] | any[];
    [key: string]: any;
}

export interface ProjectFilters extends PaginationParams {
    search?: string;
    status?: string;
    visibility?: string;
    start_year?: number;
    end_year?: number;
    min_year?: number;
    max_year?: number;
    lead_lecturer_id?: string;
    lead_lecturer_slug?: string;
    participant_id?: string;
    participant_slug?: string;
    tag_id?: string;
    tag_slug?: string;
    cluster_id?: string;
    cluster_slug?: string;
}

// Data Transfer Objects (DTOs) for creating/updating
export interface CreateProjectDTO {
    title: string;
    slug: string;
    description?: string | null;
    status?: string; // "PLANNED" | "ONGOING" | "COMPLETED"
    start_year?: number | null;
    end_year?: number | null;
    partner_names?: string | null;
    funding_source?: string | null;
    visibility?: string; // "PUBLIC" | "INTERNAL" | "HIDDEN"
    lead_lecturer_id?: string | null;
    participants?: Array<{ lecturer_id: string; role?: string | null }>;
    tag_ids?: string[];
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {}

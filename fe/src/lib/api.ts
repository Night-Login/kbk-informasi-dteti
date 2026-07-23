export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

const API_ORIGIN = API_URL.replace(/\/api(?:\/v1)?$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type QueryValue = string | number | boolean | null | undefined;

type ApiRequestOptions = RequestInit & {
  query?: Record<string, QueryValue>;
};

export async function apiRequest<T>(
  path: string,
  { query, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const requestPath = `${API_URL}/${path.replace(/^\//, "")}`;
  const isAbsoluteUrl = /^https?:\/\//.test(requestPath);
  const url = new URL(
    requestPath,
    isAbsoluteUrl ? undefined : "http://local.invalid",
  );

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const requestUrl = isAbsoluteUrl ? url : `${url.pathname}${url.search}`;
  const response = await fetch(requestUrl, {
    ...init,
    cache: init.cache || "no-store",
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.message || `API request failed with status ${response.status}`,
      response.status,
    );
  }

  return (payload?.data ?? payload) as T;
}

export function getApiAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${API_ORIGIN}/${path.replace(/^\//, "")}`;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ResearchTag {
  id: string;
  name: string;
  slug: string;
  cluster_id: string;
  description?: string | null;
  is_active?: boolean;
  cluster?: ResearchCluster;
  lecturers?: Array<{
    lecturer_id: string;
    is_primary?: boolean;
    lecturer?: Lecturer;
  }>;
  _count?: {
    lecturers?: number;
    projects?: number;
  };
}

export interface ResearchCluster {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number | null;
  lecturer_count?: number;
  project_count?: number;
  publication_count?: number;
  tags?: ResearchTagSummary[];
}

export interface ResearchTagSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  lecturer_count: number;
  project_count?: number;
}

export interface ResearchSummary {
  summary: {
    total_clusters: number;
    total_tags: number;
    active_tags: number;
    total_lecturers?: number;
    total_projects?: number;
    total_publications?: number;
  };
  clusters: ResearchCluster[];
}

export interface LecturerMetric {
  h_index?: number;
  total_citations?: number;
  sinta_score?: number | null;
  source?: string | null;
  fetched_at?: string;
}

export interface Lecturer {
  id: string;
  full_name: string;
  academic_title?: string | null;
  slug: string;
  nip_or_staff_id?: string;
  email?: string | null;
  photo_url?: string | null;
  short_bio?: string | null;
  bio?: string | null;
  sinta_id?: string | null;
  scopus_author_id?: string | null;
  google_scholar_url?: string | null;
  google_scholar_id?: string | null;
  orcid_id?: string | null;
  openalex_author_id?: string | null;
  semantic_scholar_id?: string | null;
  supervision_status?: string | null;
  is_active?: boolean;
  metrics?: LecturerMetric | null;
  research_tags?: Array<{
    lecturer_id?: string;
    tag_id?: string;
    is_primary?: boolean;
    tag?: ResearchTag;
  }>;
  publications?: Array<{
    publication_id?: string;
    author_order?: number | null;
    publication?: Publication;
  }>;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  status?: "PLANNED" | "ONGOING" | "COMPLETED";
  start_year?: number | null;
  end_year?: number | null;
  partner_names?: string | null;
  funding_source?: string | null;
  visibility?: "PUBLIC" | "INTERNAL" | "HIDDEN" | null;
  lead_lecturer_id?: string | null;
  lead_lecturer?: Lecturer | null;
  research_tags?: Array<{
    tag_id?: string;
    tag?: ResearchTag;
  }>;
  participants?: Array<{
    lecturer_id?: string;
    role?: string | null;
    lecturer?: Lecturer;
  }>;
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
  verified_status?: string;
  lecturers?: Array<{
    lecturer_id?: string;
    author_order?: number | null;
    lecturer?: Lecturer;
  }>;
}

export function getPublicationTags(publication: Publication): ResearchTag[] {
  const tags = new Map<string, ResearchTag>();

  publication.lecturers?.forEach((relation) => {
    relation.lecturer?.research_tags?.forEach((tagRelation) => {
      if (tagRelation.tag) {
        tags.set(tagRelation.tag.id, tagRelation.tag);
      }
    });
  });

  return [...tags.values()];
}

export function getProjectPeople(project: Project): Lecturer[] {
  const people = new Map<string, Lecturer>();
  if (project.lead_lecturer) {
    people.set(project.lead_lecturer.id, project.lead_lecturer);
  }
  project.participants?.forEach((relation) => {
    if (relation.lecturer) {
      people.set(relation.lecturer.id, relation.lecturer);
    }
  });
  return [...people.values()];
}

export function lecturerIsAvailable(lecturer: Lecturer): boolean {
  const status = lecturer.supervision_status?.trim().toLowerCase();
  return Boolean(
    lecturer.is_active &&
      status &&
      !["unavailable", "not available", "closed", "tidak tersedia"].includes(status),
  );
}

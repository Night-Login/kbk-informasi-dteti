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

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

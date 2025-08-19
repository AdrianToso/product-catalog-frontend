export interface PaginatedResult<T> {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    items: T[]; 
}
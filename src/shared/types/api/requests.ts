// Common request types
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchRequest extends PaginationRequest {
  query?: string;
  filters?: Record<string, any>;
}
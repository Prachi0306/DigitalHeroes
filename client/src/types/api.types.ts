export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: {
    results: T[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

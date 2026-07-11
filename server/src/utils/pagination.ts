export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export const getPaginationOptions = (query: any): PaginationOptions => {
  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 10;
  
  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 10,
  };
};

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
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
  
  const parsedPage = page > 0 ? page : 1;
  const parsedLimit = limit > 0 && limit <= 100 ? limit : 10;
  
  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

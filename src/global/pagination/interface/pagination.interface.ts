export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage?: number;
    totalItems: number;
    currentPage?: number;
    totalPages: number;
    nextPage: number;
    previoudPage: number;
    hasNextPage: boolean;
  };
}

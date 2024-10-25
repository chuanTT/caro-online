import { OmitFindManyOptionPaginated } from './omit-find-many-options.type';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number; // Thêm thuộc tính lastPage
}

export interface PaginationOptions<T> {
  page?: number;
  limit?: number;
  options: OmitFindManyOptionPaginated<T>;
}

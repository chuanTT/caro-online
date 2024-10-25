import { FindManyOptions } from 'typeorm';

export type OmitFindManyOption<T> = Omit<FindManyOptions<T>, 'where'>;

export type OmitFindManyOptionPaginated<T> = Omit<
  FindManyOptions<T>,
  'skip' | 'take'
>;

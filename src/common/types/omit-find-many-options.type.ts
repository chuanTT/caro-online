import { FindManyOptions } from 'typeorm';

export type OmitFindManyOption<T> = Omit<FindManyOptions<T>, 'where'>;

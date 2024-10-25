import { IntersectionType } from '@nestjs/mapped-types';
import { FilterDateDto } from 'src/common/dtos/filter-date.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class FindWinnerDto extends IntersectionType(
  PaginationDto,
  FilterDateDto,
) {}

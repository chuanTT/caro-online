import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { StartDateBeforeEndDate } from '../decorators/date-range.decorator';

export class FilterDateDto {
  @IsOptional()
  @IsDate({ message: 'Ngày bắt đầu không phải là ngày tháng' })
  @Type(() => Date)
  startDate: Date | null;

  @IsOptional()
  @IsDate({ message: 'Ngày kết thúc không phải là ngày tháng' })
  @Type(() => Date)
  @StartDateBeforeEndDate({
    message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
  })
  endDate: Date | null;
}

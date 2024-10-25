import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString({}, { message: 'Trang phải là một số' }) // Xác thực
  @Transform(({ value }) => Number(value)) // Chuyển đổi chuỗi thành số
  page: number;

  @IsOptional()
  @IsNumberString({}, { message: 'Giới hạn phải là một số' }) // Xác thực
  @Transform(({ value }) => Number(value)) // Chuyển đổi chuỗi thành số
  limit: number;
}

import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IdDto } from 'src/common/dtos/id.dto';

export class CreateMoveDto extends IntersectionType(IdDto) {
  @IsNumber()
  @IsNotEmpty({
    message: 'Vị trí hàng không được để trống',
  })
  @Type(() => Number)
  positionY: number;

  @IsNumber()
  @IsNotEmpty({
    message: 'Vị trí cột không được để trống',
  })
  @Type(() => Number)
  positionX: number;
}

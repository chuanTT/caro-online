import { PartialType } from '@nestjs/mapped-types';
import { CreateCaroSocketDto } from './create-caro-socket.dto';

export class UpdateCaroSocketDto extends PartialType(CreateCaroSocketDto) {
  id: number;
}

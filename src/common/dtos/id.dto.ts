import { IsUUID } from 'class-validator';

export class IdDto {
  @IsUUID(undefined, { message: 'id không đúng định dạng' })
  id: string;
}

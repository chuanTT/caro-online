import { PartialType } from '@nestjs/mapped-types';
import { CreateChessDto } from './create-chess.dto';

export class UpdateChessDto extends PartialType(CreateChessDto) {}

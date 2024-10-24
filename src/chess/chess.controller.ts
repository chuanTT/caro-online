import { Controller, Get, Patch, Param, Delete } from '@nestjs/common';
import { ChessService } from './chess.service';

@Controller('chess')
export class ChessController {
  constructor(private readonly chessService: ChessService) {}

  @Get()
  findAll() {
    return this.chessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.chessService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chessService.remove(+id);
  }
}

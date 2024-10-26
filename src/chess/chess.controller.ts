import { Controller, Get, Param, Req, UseGuards, Query } from '@nestjs/common';
import { ChessService } from './chess.service';
import { User } from 'src/user/entities/user.entity';
import { JWTAuthAccessGuard } from 'src/auth/guards/jwt-auth-access.guard';
import { FindWinnerDto } from './dto/find-winner.dto';

@UseGuards(JWTAuthAccessGuard)
@Controller('chess')
export class ChessController {
  constructor(private readonly chessService: ChessService) {}

  @Get('winner')
  findAllWinner(
    @Req() resquest: Request,
    @Query() findWinnerDto: FindWinnerDto,
  ) {
    const user: User = resquest['user'];
    return this.chessService.findAllWinder(user?.id, findWinnerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() resquest: Request) {
    const user: User = resquest['user'];
    return this.chessService.findOne(id, user?.id);
  }
}

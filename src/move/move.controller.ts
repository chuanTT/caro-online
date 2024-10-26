import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MoveService } from './move.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { JWTAuthAccessGuard } from 'src/auth/guards/jwt-auth-access.guard';
import { User } from 'src/user/entities/user.entity';

@UseGuards(JWTAuthAccessGuard)
@Controller('move')
export class MoveController {
  constructor(private readonly moveService: MoveService) {}

  @Post()
  create(@Body() createMoveDto: CreateMoveDto, @Req() request: Request) {
    const user = request['user'] as User;
    return this.moveService.create(createMoveDto, user);
  }
}

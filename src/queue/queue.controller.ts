import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  // UseGuards,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { JWTAuthAccessGuard } from 'src/auth/guards/jwt-auth-access.guard';

@UseGuards(JWTAuthAccessGuard)
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  create(@Req() request: Request) {
    const user = request['user'];
    return user;
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.queueService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }
}

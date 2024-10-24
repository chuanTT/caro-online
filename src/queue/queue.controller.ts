import { Controller, Post, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { JWTAuthAccessGuard } from 'src/auth/guards/jwt-auth-access.guard';
import { IdDto } from 'src/common/dtos/id.dto';

@UseGuards(JWTAuthAccessGuard)
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}
  @Post()
  create(@Req() request: Request) {
    const user = request['user'];
    return this.queueService.create(user);
  }

  @Patch('cancel/:id')
  cancel(@Param() { id }: IdDto) {
    return this.queueService.cancelQueue(id);
  }
}

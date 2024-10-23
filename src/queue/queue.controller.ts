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
import { IdDto } from 'src/common/dtos/id.dto';

@UseGuards(JWTAuthAccessGuard)
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Post()
  create(@Req() request: Request) {
    const user = request['user'];
    return this.queueService.create(user);
  }

  @Patch('cancel/:id')
  cancel(@Param() { id }: IdDto) {
    return this.queueService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: IdDto) {
    return this.queueService.remove(+id);
  }
}

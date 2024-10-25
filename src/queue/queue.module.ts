import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './entities/queue.entity';
import { ChessModule } from 'src/chess/chess.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), ChessModule],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}

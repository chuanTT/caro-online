import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './entities/queue.entity';
import { UserModule } from 'src/user/user.module';
import { ChessModule } from 'src/chess/chess.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), UserModule, ChessModule],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}

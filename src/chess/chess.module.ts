import { Module } from '@nestjs/common';
import { ChessService } from './chess.service';
import { ChessController } from './chess.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chess } from './entities/chess.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chess])],
  controllers: [ChessController],
  providers: [ChessService],
  exports: [ChessService],
})
export class ChessModule {}

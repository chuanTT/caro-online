import { Module } from '@nestjs/common';
import { MoveService } from './move.service';
import { MoveController } from './move.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Move } from './entities/move.entity';
import { ChessModule } from 'src/chess/chess.module';

@Module({
  imports: [TypeOrmModule.forFeature([Move]), ChessModule],
  controllers: [MoveController],
  providers: [MoveService],
})
export class MoveModule {}

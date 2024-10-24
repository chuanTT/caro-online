import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Chess } from './entities/chess.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChessService {
  constructor(
    @InjectRepository(Chess)
    private chessRepository: Repository<Chess>,
  ) {}

  create(player1: User, player2: User) {
    const chess = new Chess();
    chess.player1 = player1;
    chess.player2 = player2;
    return this.chessRepository.save(chess);
  }

  findAll() {
    return `This action returns all chess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chess`;
  }

  update(id: number) {
    return `This action updates a #${id} chess`;
  }

  remove(id: number) {
    return `This action removes a #${id} chess`;
  }
}

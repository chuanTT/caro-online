import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateMoveDto } from './dto/create-move.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Move } from './entities/move.entity';
import { Repository } from 'typeorm';
import { ChessService } from 'src/chess/chess.service';
import { User } from 'src/user/entities/user.entity';
import { Chess } from 'src/chess/entities/chess.entity';

@Injectable()
export class MoveService {
  constructor(
    @InjectRepository(Move)
    private moveRepository: Repository<Move>,
    private readonly chessService: ChessService,
  ) {}
  // Kiểm tra vị trí có hợp lệ hay không
  async isPositionValid(
    positionX: number,
    positionY: number,
    currentChess: Chess,
    id: string,
  ): Promise<boolean> {
    const numberOfRows = currentChess?.row; // Số hàng của bàn cờ
    const numberOfColumns = currentChess?.column; // Số cột của bàn cờ

    // Kiểm tra vị trí có nằm trong giới hạn bàn cờ không
    if (
      positionX < 0 ||
      positionX >= numberOfColumns ||
      positionY < 0 ||
      positionY >= numberOfRows
    ) {
      return false;
    }

    // Kiểm tra xem ô có trống không (chưa có quân nào)
    const existingMove = await this.moveRepository.findOne({
      where: {
        positionX,
        positionY,
        chess: {
          id,
        },
      },
    });

    return !existingMove; // Nếu không có quân ở vị trí này thì vị trí hợp lệ
  }

  async create({ id, positionX, positionY }: CreateMoveDto, user: User) {
    const currentChess = await this.chessService.findOneOnGoing(id, user?.id);
    const current = await this.chessService.canPlayerMakeMove(id, user?.id);
    if (!current) {
      throw new UnprocessableEntityException('Bạn chưa đến lượt');
    }
    const isValid = await this.isPositionValid(
      positionX,
      positionY,
      currentChess,
      id,
    );
    if (!isValid) {
      throw new UnprocessableEntityException(
        'Vị trí không hợp lệ hoặc đã có đối thủ đánh vào rồi',
      );
    }
    const moveLastNumber = await this.getLastMove(id, user?.id);
    const newMoveLastNumber = (moveLastNumber?.moveNumber ?? 0) + 1;
    const moveValue = Object.assign({ positionX, positionY }, new Move());
    moveValue.player = user;
    moveValue.moveNumber = newMoveLastNumber;
    moveValue.chess = currentChess;
    const currentMoveCreate = await this.moveRepository.save(moveValue);
    await this.chessService.updateTurn(id, user?.id);
    if (newMoveLastNumber >= 5) {
      // check wind
      const isWinner = await this.checkWin(user?.id, { positionX, positionY });
      console.log(isWinner);
    }
    return currentMoveCreate;
  }

  async getLastMove(chessId: string, userId?: string): Promise<Move> {
    return this.moveRepository.findOne({
      // order: { createdAt: 'DESC' }, // Sắp xếp theo thời gian giảm dần
      where: {
        chess: {
          id: chessId,
        },
        ...(userId ? { player: { id: userId } } : {}),
      },
    });
  }

  async checkWin(
    playerId: string,
    lastMove: { positionX: number; positionY: number },
  ): Promise<boolean> {
    const directions = [
      { dx: 1, dy: 0 }, // Hàng
      { dx: 0, dy: 1 }, // Cột
      { dx: 1, dy: 1 }, // Đường chéo /
      { dx: 1, dy: -1 }, // Đường chéo \
    ];

    for (const { dx, dy } of directions) {
      // Kiểm tra số lượng quân cờ liên tiếp
      const count = await this.countConsecutiveMoves(
        playerId,
        lastMove.positionX,
        lastMove.positionY,
        dx,
        dy,
      );
      // Kiểm tra số lượng ở cả 2 đầu
      const countReverse = await this.countConsecutiveMoves(
        playerId,
        lastMove.positionX,
        lastMove.positionY,
        -dx,
        -dy,
      );

      if (count + countReverse >= 4) {
        return true; // Người chơi thắng
      }
    }

    return false; // Không có người thắng
  }

  private async countConsecutiveMoves(
    playerId: string,
    x: number,
    y: number,
    dx: number,
    dy: number,
  ): Promise<number> {
    let count = 0;

    while (true) {
      x += dx;
      y += dy;

      const move = await this.moveRepository.findOne({
        where: {
          positionX: x,
          positionY: y,
          player: { id: playerId }, // Lọc theo người chơi
        },
      });

      if (!move) break; // Không tìm thấy nước đi, thoát khỏi vòng lặp
      count++;
    }

    return count;
  }
}

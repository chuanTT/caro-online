import { User } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashHexSha256 } from 'src/common/utils/hard-hex.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto = Object.assign(new User(), createUserDto);
    return await this.usersRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOneUserByUuid(uuid: string, options?: FindOneOptions<User>) {
    return this.usersRepository.findOne({
      ...(options ?? {}),
      where: {
        uuid,
        ...(options?.where ?? {}),
      },
    });
  }

  findOneEmail(email: string) {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  updateToken(id: string, token: string) {
    const hashToken = hashHexSha256(token);
    return this.usersRepository.update(id, { refreshToken: hashToken });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

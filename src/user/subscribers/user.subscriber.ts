import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { hashPassSync } from 'src/common/utils/password.util';
import { defaultAvatar } from 'src/common/utils/default-avatar.util';

@Injectable()
@EventSubscriber() // Decorator của TypeORM
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectDataSource() readonly datasource: DataSource,
    private readonly configService: ConfigService,
  ) {
    datasource.subscribers.push(this);
  }
  /**
   * Chỉ định subscriber này lắng nghe entity User
   */
  listenTo() {
    return User;
  }

  /**
   * Lắng nghe sự kiện trước khi một user được insert
   */
  beforeInsert(event: InsertEvent<User>) {
    const keySecret = this.configService.get('password.secret');
    const newPass = event.entity.password + keySecret;
    event.entity.password = hashPassSync(newPass);
    event.entity.avatar = defaultAvatar();
  }

  // Tương tự cho update và remove
}

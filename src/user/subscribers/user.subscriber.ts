import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  DataSource,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { defaultAvatar } from 'src/common/utils/default-avatar.util';
import { hashPassSync } from 'src/common/utils/password.util';

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

  private hassPassword(password: string) {
    const keySecret = this.configService.get('password.secret');
    const newPass = password + keySecret;
    return hashPassSync(newPass);
  }

  /**
   * Lắng nghe sự kiện trước khi một user được insert
   */
  beforeInsert(event: InsertEvent<User>) {
    event.entity.password = this.hassPassword(event.entity.password);
    event.entity.avatar = defaultAvatar();
  }

  beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity?.password) {
      event.entity.password = this.hassPassword(event.entity.password);
    }
  }

  // Tương tự cho update và remove
}

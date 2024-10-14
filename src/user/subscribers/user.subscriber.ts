import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
// import { hashSync } from 'bcrypt';

@EventSubscriber() // Decorator của TypeORM
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(private readonly configService: ConfigService) {}
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
    console.log(this.configService);
    // const keySecret = this.configService.get('SECRET_KEY_PASSWORD');
    // const newPass = event.entity.password + keySecret;
    // event.entity.password = hashSync(newPass, 10);
  }

  // Tương tự cho update và remove
}

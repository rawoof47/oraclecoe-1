import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { MailModule } from '../mail/mail.module'; // ✅ import MailModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule, // ✅ add this line
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}

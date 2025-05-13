import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBadgesService } from './user-badges.service';
import { UserBadgesController } from './user-badges.controller';
import { UserBadge } from './entities/user-badge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBadge])],
  controllers: [UserBadgesController],
  providers: [UserBadgesService],
})
export class UserBadgesModule {}

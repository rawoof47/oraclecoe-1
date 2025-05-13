import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Badge])],  // Ensure Badge is registered
  providers: [BadgesService],
  controllers: [BadgesController],
})
export class BadgesModule {}

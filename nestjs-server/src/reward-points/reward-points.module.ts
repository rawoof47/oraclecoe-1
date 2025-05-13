import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardPoints } from './entities/reward-point.entity';
import { RewardPointsService } from './reward-points.service';
import { RewardPointsController } from './reward-points.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RewardPoints])],
  providers: [RewardPointsService],
  controllers: [RewardPointsController],
})
export class RewardPointsModule {}

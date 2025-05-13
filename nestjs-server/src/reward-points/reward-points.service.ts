import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardPoints } from './entities/reward-point.entity';
import { CreateRewardPointsDto } from './dto/create-reward-point.dto';
import { UpdateRewardPointsDto } from './dto/update-reward-point.dto';

@Injectable()
export class RewardPointsService {
  constructor(
    @InjectRepository(RewardPoints)
    private readonly rewardPointsRepository: Repository<RewardPoints>,
  ) {}

  // Create a new reward point entry
  async create(createRewardPointsDto: CreateRewardPointsDto): Promise<RewardPoints> {
    const rewardPoints = this.rewardPointsRepository.create(createRewardPointsDto);
    return this.rewardPointsRepository.save(rewardPoints);
  }

  // Get reward points by user_id
  async findOne(user_id: string): Promise<RewardPoints | null> {
    return this.rewardPointsRepository.findOneBy({ user_id });
  }

  // Update existing reward points entry
  async update(user_id: string, updateRewardPointsDto: UpdateRewardPointsDto): Promise<RewardPoints | null> {
    const rewardPoints = await this.findOne(user_id);
    if (rewardPoints) {
      const updatedRewardPoints = Object.assign(rewardPoints, updateRewardPointsDto);
      return this.rewardPointsRepository.save(updatedRewardPoints);
    }
    return null;
  }
}

import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { RewardPointsService } from './reward-points.service';
import { CreateRewardPointsDto } from './dto/create-reward-point.dto';
import { UpdateRewardPointsDto } from './dto/update-reward-point.dto';

@Controller('reward-points')
export class RewardPointsController {
  constructor(private readonly rewardPointsService: RewardPointsService) {}

  // Create new reward points
  @Post()
  async create(@Body() createRewardPointsDto: CreateRewardPointsDto) {
    return this.rewardPointsService.create(createRewardPointsDto);
  }

  // Get reward points by user_id
  @Get(':user_id')
  async findOne(@Param('user_id') user_id: string) {
    return this.rewardPointsService.findOne(user_id);
  }

  // Update reward points for a user
  @Patch(':user_id')
  async update(
    @Param('user_id') user_id: string,
    @Body() updateRewardPointsDto: UpdateRewardPointsDto,
  ) {
    return this.rewardPointsService.update(user_id, updateRewardPointsDto);
  }
}

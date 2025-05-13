import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBadge } from './entities/user-badge.entity';
import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UpdateUserBadgeDto } from './dto/update-user-badge.dto';

@Injectable()
export class UserBadgesService {
  constructor(
    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,
  ) {}

  // Create a new user badge
  create(createUserBadgeDto: CreateUserBadgeDto) {
    const userBadge = this.userBadgeRepository.create(createUserBadgeDto);
    return this.userBadgeRepository.save(userBadge);
  }

  // Get all user badges
  findAll() {
    return this.userBadgeRepository.find();
  }

  // Get a user badge by ID
  findOne(id: string) {
    return this.userBadgeRepository.findOne({ where: { id } });
  }

  // Update a user badge
  update(id: string, updateUserBadgeDto: UpdateUserBadgeDto) {
    return this.userBadgeRepository.update(id, updateUserBadgeDto);
  }

  // Delete a user badge
  remove(id: string) {
    return this.userBadgeRepository.delete(id);
  }
}

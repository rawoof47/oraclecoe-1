import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
  ) {}

  async create(dto: CreateBadgeDto): Promise<Badge> {
    const badge = this.badgeRepository.create(dto);
    return await this.badgeRepository.save(badge);
  }

  async findAll(): Promise<Badge[]> {
    return this.badgeRepository.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string): Promise<Badge> {
    return await this.badgeRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateBadgeDto): Promise<Badge> {
    const badge = await this.badgeRepository.findOneOrFail({ where: { id } });
    Object.assign(badge, dto);
    return await this.badgeRepository.save(badge);
  }

  async remove(id: string): Promise<void> {
    await this.badgeRepository.delete(id);
  }
}

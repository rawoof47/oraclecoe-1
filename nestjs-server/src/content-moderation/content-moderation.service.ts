import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentModeration } from './entities/content-moderation.entity';
import { CreateContentModerationDto } from './dto/create-content-moderation.dto';
import { UpdateContentModerationDto } from './dto/update-content-moderation.dto';

@Injectable()
export class ContentModerationService {
  constructor(
    @InjectRepository(ContentModeration)
    private readonly moderationRepo: Repository<ContentModeration>,
  ) {}

  async create(dto: CreateContentModerationDto): Promise<ContentModeration> {
    const record = this.moderationRepo.create(dto);
    return await this.moderationRepo.save(record);
  }

  async findAll(): Promise<ContentModeration[]> {
    return await this.moderationRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ContentModeration> {
    return await this.moderationRepo.findOneOrFail({ where: { id } });
  }

  async update(id: string, dto: UpdateContentModerationDto): Promise<ContentModeration> {
    const record = await this.moderationRepo.findOneOrFail({ where: { id } });
    Object.assign(record, dto);
    return await this.moderationRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    await this.moderationRepo.delete(id);
  }
}

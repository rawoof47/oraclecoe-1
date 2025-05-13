import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  // Create a new activity log
  async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog> {
    const activityLog = this.activityLogRepository.create({
      ...createActivityLogDto,
      metadata: createActivityLogDto.metadata || null,
      points_awarded: createActivityLogDto.points_awarded || 0,
    });

    return await this.activityLogRepository.save(activityLog);
  }

  // Fetch all activity logs
  async findAll(): Promise<ActivityLog[]> {
    return await this.activityLogRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  // Fetch a single activity log by UUID
  async findOne(id: string): Promise<ActivityLog> {
    const log = await this.activityLogRepository.findOne({ where: { id } });

    if (!log) {
      throw new NotFoundException(`ActivityLog with ID ${id} not found`);
    }

    return log;
  }

  // Update an activity log by ID
  async update(id: string, updateDto: UpdateActivityLogDto): Promise<ActivityLog> {
    const result = await this.activityLogRepository.update(id, updateDto);

    if (result.affected === 0) {
      throw new NotFoundException(`ActivityLog with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  // Delete an activity log by ID
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.activityLogRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ActivityLog with ID ${id} not found`);
    }

    return { message: `ActivityLog with ID ${id} has been deleted` };
  }
}

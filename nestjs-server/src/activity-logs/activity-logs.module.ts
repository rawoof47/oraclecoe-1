// src/activity-logs/activity-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLog } from './entities/activity-log.entity';  // Assuming this is your entity

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],  // Make sure the ActivityLog repository is available here
  providers: [ActivityLogsService],
  controllers: [ActivityLogsController],
})
export class ActivityLogsModule {}

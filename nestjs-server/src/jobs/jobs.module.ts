// src/jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobPost } from '../job-posts/entities/job-post.entity'; // adjust path if needed

@Module({
  imports: [TypeOrmModule.forFeature([JobPost])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}

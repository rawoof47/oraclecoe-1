import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostsService } from './job-posts.service';
import { JobPostsController } from './job-posts.controller';
import { JobPost } from './entities/job-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost])],
  controllers: [JobPostsController],
  providers: [JobPostsService],
  exports: [JobPostsService], // <-- Exported for use in other modules if needed
})
export class JobPostsModule {}

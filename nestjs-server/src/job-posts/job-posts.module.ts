// job-posts.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostsService } from './job-posts.service';
import { JobPostsController } from './job-posts.controller';
import { JobPost } from './entities/job-post.entity';
import { JobPostSkillModule } from '../job-post-skill/job-post-skill.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost]),
    forwardRef(() => JobPostSkillModule), // 👈 circular dependency fix
  ],
  controllers: [JobPostsController],
  providers: [JobPostsService],
  exports: [JobPostsService],
})
export class JobPostsModule {}

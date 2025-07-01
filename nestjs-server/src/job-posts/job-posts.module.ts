import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostsService } from './job-posts.service';
import { JobPostsController } from './job-posts.controller';
import { JobPost } from './entities/job-post.entity';
import { JobExpiryCron } from './cron/job-expiry.cron';
import { JobPostSkillModule } from '../job-post-skill/job-post-skill.module';
import { JobPostCertificationsModule } from '../job-post-certification/job-post-certifications.module'; // ✅ Import module

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost]),
    forwardRef(() => JobPostSkillModule), // 👈 circular dependency fix
    JobPostCertificationsModule, // ✅ Add certification module here
  ],
  controllers: [JobPostsController],
  providers: [JobPostsService, JobExpiryCron],
  exports: [JobPostsService],
})
export class JobPostsModule {}

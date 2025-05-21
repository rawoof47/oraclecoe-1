// job-post-skill.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostSkill } from './entities/job-post-skill.entity';
import { JobPostSkillService } from './job-post-skill.service';
import { JobPostSkillController } from './job-post-skill.controller';
import { JobPostsModule } from '../job-posts/job-posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPostSkill]),
    forwardRef(() => JobPostsModule), // 👈 circular dependency fix
  ],
  providers: [JobPostSkillService],
  controllers: [JobPostSkillController],
  exports: [JobPostSkillService],
})
export class JobPostSkillModule {}

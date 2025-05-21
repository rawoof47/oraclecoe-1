import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './entities/skill.entity';
import { JobPostSkillModule } from 'src/job-post-skill/job-post-skill.module';


@Module({
  imports: [TypeOrmModule.forFeature([Skill]), JobPostSkillModule],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService], // Optional: if used in other modules
})
export class SkillsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateSkill } from './entities/candidate-skill.entity';
import { CandidateSkillsService } from './candidate-skills.service';
import { CandidateSkillsController } from './candidate-skills.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateSkill])],  // Register CandidateSkill entity
  providers: [CandidateSkillsService],
  controllers: [CandidateSkillsController],
})
export class CandidateSkillsModule {}

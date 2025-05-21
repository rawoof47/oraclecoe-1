import { PartialType } from '@nestjs/mapped-types';
import { CreateJobPostSkillDto } from './create-job-post-skill.dto';

export class UpdateJobPostSkillDto extends PartialType(CreateJobPostSkillDto) {}

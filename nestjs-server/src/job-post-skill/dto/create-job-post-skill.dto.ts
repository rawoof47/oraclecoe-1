import { IsUUID } from 'class-validator';

export class CreateJobPostSkillDto {
  @IsUUID()
  job_post_id: string;

  @IsUUID()
  skill_id: string;
}

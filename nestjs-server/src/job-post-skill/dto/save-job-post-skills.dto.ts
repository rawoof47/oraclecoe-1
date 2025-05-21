import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class SaveJobPostSkillsDto {
  @IsUUID()
  jobPostId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  skillIds: string[];
}

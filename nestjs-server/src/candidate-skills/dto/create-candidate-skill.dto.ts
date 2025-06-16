import { IsUUID, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateCandidateSkillsBulkDto {
  @IsUUID()
  user_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skill_ids: string[];
}
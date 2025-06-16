import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class UpdateCandidateSkillDto {
  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsUUID()
  module_id?: string;

  @IsOptional()
  @IsUUID()
  verification_status_id?: string;

  @IsOptional()
  @IsString()
  proficiency?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  years_experience?: number;

  @IsOptional()
  @IsUUID()
  updated_by?: string;
}

import { IsUUID, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCandidateSkillDto {
  @IsUUID()
  candidate_id: string;

  @IsUUID()
  module_id: string;

  @IsString()
  @IsOptional()
  proficiency?: string;

  @IsNumber()
  @IsOptional()
  years_experience?: number;

  @IsUUID()
  @IsOptional()
  verification_status_id?: string;

  @IsUUID()
  @IsOptional()
  created_by?: string;

  @IsUUID()
  @IsOptional()
  updated_by?: string;
}

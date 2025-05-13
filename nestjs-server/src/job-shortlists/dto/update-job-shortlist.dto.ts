import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateJobShortlistDto {
  @IsOptional()
  @IsUUID()
  job_id?: string;

  @IsOptional()
  @IsUUID()
  recruiter_id?: string;

  @IsOptional()
  @IsUUID()
  candidate_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  labels?: string;
}

import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateJobShortlistDto {
  @IsUUID()
  job_id: string;

  @IsUUID()
  recruiter_id: string;

  @IsUUID()
  candidate_id: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  labels: string;
}

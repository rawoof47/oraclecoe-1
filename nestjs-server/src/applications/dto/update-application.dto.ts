import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsUUID()
  @IsOptional()
  candidate_id?: string;

  @IsUUID()
  @IsOptional()
  job_id?: string;

  @IsUUID()
  @IsOptional()
  application_status_id?: string;

  @IsBoolean()
  @IsOptional()
  withdrawn?: boolean;

  @IsUUID()
  @IsOptional()
  updated_by?: string;
}

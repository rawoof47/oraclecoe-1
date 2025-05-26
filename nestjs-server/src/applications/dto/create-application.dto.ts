// src/applications/dto/create-application.dto.ts

import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateApplicationDto {
  @IsUUID()
  @IsNotEmpty()
  candidate_id: string;

  @IsUUID()
  @IsNotEmpty()
  job_id: string;

  @IsUUID()
  @IsNotEmpty()
  application_status_id: string;

  @IsOptional()
  @IsBoolean()
  withdrawn?: boolean;

  @IsOptional()
  @IsUUID()
  created_by?: string;

  @IsOptional()
  @IsUUID()
  updated_by?: string;
}

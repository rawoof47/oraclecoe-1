// src/applications/dto/create-application.dto.ts

import {
  IsString,
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

  @IsString()
  @IsNotEmpty()
  status: string; // Maps to application_status_id

  @IsOptional()
  @IsBoolean()
  withdrawn?: boolean; // Optional boolean, defaults to false if not provided

  @IsOptional()
  @IsUUID()
  created_by?: string; // Optional user ID

  @IsOptional()
  @IsUUID()
  updated_by?: string; // Optional user ID
}

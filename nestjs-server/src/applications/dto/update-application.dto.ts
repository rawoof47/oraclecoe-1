// src/applications/dto/update-application.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsUUID, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO for updating an existing job application.
 * All fields are optional to support partial updates.
 */
export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  /**
   * Updated candidate UUID (optional).
   */
  @IsUUID()
  @IsOptional()
  candidate_id?: string;

  /**
   * Updated job UUID (optional).
   */
  @IsUUID()
  @IsOptional()
  job_id?: string;

  /**
   * Updated application status UUID (optional).
   */
  @IsUUID()
  @IsOptional()
  application_status_id?: string;

  /**
   * Flag to mark the application as withdrawn (optional).
   */
  @IsOptional()
  @IsBoolean()
  withdrawn?: boolean;

  /**
   * UUID of the user who updated the record (optional).
   */
  @IsUUID()
  @IsOptional()
  updated_by?: string;
}

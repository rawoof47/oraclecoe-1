import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

/**
 * DTO for creating a new job application.
 */
export class CreateApplicationDto {
  /**
   * UUID of the candidate applying.
   */
  @IsUUID()
  @IsNotEmpty()
  candidate_id: string;

  /**
   * UUID of the job being applied to.
   */
  @IsUUID()
  @IsNotEmpty()
  job_id: string;

  /**
   * UUID representing the current application status.
   * Optional if backend sets a default status.
   */
  @IsOptional()
  @IsUUID()
  application_status_id?: string;

  /**
   * Whether the candidate has withdrawn the application.
   */
  @IsOptional()
  @IsBoolean()
  withdrawn?: boolean;

  /**
   * UUID of the user who created the record (optional).
   */
  @IsOptional()
  @IsUUID()
  created_by?: string;

  /**
   * UUID of the user who last updated the record (optional).
   */
  @IsOptional()
  @IsUUID()
  updated_by?: string;
}

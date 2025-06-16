import {
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateCandidateProfileDto {
  @IsString()
  @IsOptional()
  about_me?: string;

  @IsString()
  @IsOptional()
  professional_summary?: string;

  @IsString()
  @IsOptional()
  social_links?: string;

  @IsUrl()
  @IsOptional()
  resume_link?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(50)
  @IsOptional()
  experience_years?: number;

  @IsString()
  @IsOptional()
  notice_period?: string;

  // ✅ Added gender field
  @IsString()
  @IsOptional()
  gender?: string;

  // ✅ Optional metadata fields (will be set in service using userId)
  @IsUUID()
  @IsOptional()
  created_by?: string;

  @IsUUID()
  @IsOptional()
  updated_by?: string;
}

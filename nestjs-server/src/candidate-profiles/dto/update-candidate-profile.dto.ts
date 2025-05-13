import { IsString, IsEmail, IsOptional, IsUUID, IsInt, IsBoolean } from 'class-validator';

export class UpdateCandidateProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsUUID()
  @IsOptional()
  status_id: string | null;

  @IsString()
  @IsOptional()
  location: string | null;

  @IsString()
  @IsOptional()
  summary: string | null;

  @IsInt()
  @IsOptional()
  experience_years: number | null;

  @IsString()
  @IsOptional()
  notice_period: string | null;

  @IsBoolean()
  @IsOptional()
  remote_preference: boolean;

  @IsString()
  @IsOptional()
  resume_url: string | null;

  @IsString()
  @IsOptional()
  profile_photo_url: string | null;

  @IsUUID()
  @IsOptional()
  created_by: string | null;

  @IsUUID()
  @IsOptional()
  updated_by: string | null;
}

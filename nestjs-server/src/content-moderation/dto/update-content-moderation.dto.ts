import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class UpdateContentModerationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  reviewed_by?: string;

  @IsOptional()
  @IsDateString()
  reviewed_at?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

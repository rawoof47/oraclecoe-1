import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateContentModerationDto {
  @IsUUID()
  content_id: string;

  @IsOptional()
  @IsString()
  content_type?: string;

  @IsOptional()
  @IsUUID()
  flagged_by?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

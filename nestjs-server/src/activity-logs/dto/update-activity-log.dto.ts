import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateActivityLogDto {
  @IsOptional()
  @IsString()
  action_type?: string;

  @IsOptional()
  @IsString()
  metadata?: string;

  @IsOptional()
  @IsInt()
  points_awarded?: number;
}

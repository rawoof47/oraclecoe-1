import { IsString, IsUUID, IsOptional, IsInt } from 'class-validator';

export class CreateActivityLogDto {
  @IsUUID()
  user_id: string;

  @IsString()
  action_type: string;

  @IsOptional()
  @IsString()
  metadata?: string;

  @IsOptional()
  @IsInt()
  points_awarded?: number;
}

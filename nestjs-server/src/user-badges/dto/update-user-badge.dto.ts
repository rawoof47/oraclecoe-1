import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateUserBadgeDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  badge_id?: string;

  @IsOptional()
  @IsString()
  source_action?: string;
}

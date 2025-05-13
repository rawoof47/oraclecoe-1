import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateUserBadgeDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  badge_id: string;

  @IsOptional()
  @IsString()
  source_action?: string;
}

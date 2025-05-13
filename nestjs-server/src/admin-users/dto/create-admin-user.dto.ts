import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateAdminUserDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsString()
  role_level?: string;

  @IsOptional()
  @IsString()
  assigned_sections?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

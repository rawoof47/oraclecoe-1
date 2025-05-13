import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  role_name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

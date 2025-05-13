import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mobile_number?: string;

  @IsOptional()
  @IsString()
  password_hash?: string;

  @IsOptional()
  @IsString()
  role_id?: string;

  @IsOptional()
  @IsString()
  status_id?: string;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;
}

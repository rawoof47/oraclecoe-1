import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mobile_number?: string;

  @IsString()
  password_hash: string;

  @IsString()
  role_id: string;

  @IsString()
  status_id: string;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;
}

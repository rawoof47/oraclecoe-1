import { IsString, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  first_name: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  middle_name?: string;

  @IsString()
  @Length(1, 50)
  last_name: string;

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

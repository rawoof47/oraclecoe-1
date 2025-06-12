import { IsString, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  middle_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  last_name?: string;

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

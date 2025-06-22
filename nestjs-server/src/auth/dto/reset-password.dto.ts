import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  mobile_number: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;
}

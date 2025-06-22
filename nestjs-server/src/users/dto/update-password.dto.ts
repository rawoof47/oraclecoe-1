import { IsNotEmpty, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
  })
  password: string;
}

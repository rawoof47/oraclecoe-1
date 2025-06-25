import { IsString, MaxLength } from 'class-validator';

export class CreateIndustryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(100)
  description: string;
}

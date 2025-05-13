import {
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class UpdateBadgeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  icon_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  criteria_type?: string;

  @IsOptional()
  @IsInt()
  criteria_value?: number;
}

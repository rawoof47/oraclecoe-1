import {
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class UpdateApiAccessTokenDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsInt()
  usage_limit?: number;

  @IsOptional()
  @IsInt()
  usage_count?: number;

  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}

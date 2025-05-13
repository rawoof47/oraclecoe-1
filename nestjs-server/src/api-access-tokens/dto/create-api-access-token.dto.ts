import {
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateApiAccessTokenDto {
  @IsUUID()
  user_id: string;

  @IsString()
  @MaxLength(255)
  token: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsInt()
  usage_limit?: number;

  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @IsOptional()
  @IsString()
  status?: string;
}

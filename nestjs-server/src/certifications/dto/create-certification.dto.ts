import { IsUUID, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCertificationDto {
  @IsUUID()
  category_id: string;

  @IsString()
  @MaxLength(150)
  certification_name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

import { IsEnum, IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { DegreeLevel } from '../entities/degree.entity';

export class CreateDegreeDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  abbreviation?: string;

  @IsEnum(DegreeLevel)
  level: DegreeLevel;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string = 'Global';

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateStatusCategoryDto {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsOptional()
  @IsString()
  description?: string;
}

import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string; // Updated the property name to match the database column
}

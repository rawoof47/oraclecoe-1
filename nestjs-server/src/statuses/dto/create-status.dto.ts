import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  status_name: string;

  @IsUUID()
  status_category_id: string;

  @IsOptional()
  @IsString()
  description?: string;
}

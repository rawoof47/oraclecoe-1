import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateOracleModuleDto {
  @IsOptional()
  @IsString()
  module_name?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsUUID()
  status_id?: string;

  @IsOptional()
  @IsUUID()
  updated_by?: string;
}

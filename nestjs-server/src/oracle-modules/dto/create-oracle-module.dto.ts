import { IsString, IsUUID } from 'class-validator';

export class CreateOracleModuleDto {
  @IsString()
  module_name: string;

  @IsUUID()
  category_id: string;

  @IsUUID()
  status_id: string;

  @IsUUID()
  created_by: string;
}

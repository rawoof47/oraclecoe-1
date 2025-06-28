
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateRecruiterLocationDto {
  @IsOptional()
  @IsUUID()
  region_id?: string;

  @IsOptional()
  @IsUUID()
  country_id?: string;
}

import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @IsUUID()
  category_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

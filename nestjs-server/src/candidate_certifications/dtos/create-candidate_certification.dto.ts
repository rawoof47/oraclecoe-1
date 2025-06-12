import { IsUUID, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateCandidateCertificationsBulkDto {
  @IsUUID()
  user_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  certification_ids: string[];
}
import { IsUUID, IsArray, IsString } from 'class-validator'; // ✅ Removed ArrayNotEmpty

export class CreateCandidateCertificationsBulkDto {
  @IsUUID()
  user_id: string;

  @IsArray()
  @IsString({ each: true })
  certification_ids: string[]; // ✅ Now optional to be empty
}

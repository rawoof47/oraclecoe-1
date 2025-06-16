// update-candidate-profile.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateProfileDto } from './create-candidate-profile.dto';
import { IsUUID } from 'class-validator';

export class UpdateCandidateProfileDto extends PartialType(CreateCandidateProfileDto) {
  @IsUUID()
  updated_by: string; // ✅ Required for updateProfile logic
}

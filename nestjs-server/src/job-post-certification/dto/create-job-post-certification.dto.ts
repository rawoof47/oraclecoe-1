// job-post-certifications/dto/create-job-post-certification.dto.ts
import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateJobPostCertificationDto {
  @IsUUID()
  jobPostId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  certificationIds: string[];
}

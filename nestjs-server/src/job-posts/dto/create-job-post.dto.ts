import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateJobPostDto {
  @IsUUID()
  @IsNotEmpty()
  recruiterId: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  certificationsRequired?: string;

  @IsNumber()
  @IsNotEmpty()
  experienceMin: number;

  @IsNumber()
  @IsNotEmpty()
  experienceMax: number;

  @IsString()
  @IsNotEmpty()
  employmentType: string;

  @IsString()
  @IsNotEmpty()
  compensationRange: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  noticePeriod: string;

  @IsDateString()
  @IsOptional()
  applicationDeadline?: string;

  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @IsUUID()
  @IsOptional()
  updatedBy?: string;

  @IsOptional()
  @IsIn(['Remote', 'On-site', 'Hybrid'])
  workMode?: 'Remote' | 'On-site' | 'Hybrid';

  // ✅ New columns
  @IsString()
  @IsOptional()
  roleSummary?: string;

  @IsString()
  @IsOptional()
  preferredQualifications?: string;

  @IsString()
  @IsOptional()
  whatWeOffer?: string;

  @IsString()
@IsOptional()
salaryType?: string;


  @IsString()
  @IsOptional()
  howToApply?: string;

  // ✅ Skill ID array for job_post_skills relation
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];

  // ✅ Certification ID array for job_post_certifications relation
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificationIds?: string[];

  // ✅ NEW: Job Number (auto-assigned, not required from client)
  @IsOptional()
  @IsNumber()
  jobNumber?: number;
}

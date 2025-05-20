import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';

export class UpdateJobPostDto {
  @IsUUID()
  @IsOptional()
  recruiterId?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  modulesRequired?: string;

  @IsString()
  @IsOptional()
  skillsRequired?: string;

  @IsString()
  @IsOptional()
  certificationsRequired?: string;

  @IsNumber()
  @IsOptional()
  experienceMin?: number;

  @IsNumber()
  @IsOptional()
  experienceMax?: number;

  @IsString()
  @IsOptional()
  employmentType?: string;

  @IsString()
  @IsOptional()
  compensationRange?: string;

  @IsString()
  @IsOptional()
  jobDescription?: string;

  @IsString()
  @IsOptional()
  noticePeriod?: string;

  @IsUUID()
  @IsOptional()
  statusId?: string;

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
  @IsArray()
  @IsString({ each: true })
  workMode?: string[];

  // ✅ NEW FIELD ADDED
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  oracleDomainExpertise?: string[];
}

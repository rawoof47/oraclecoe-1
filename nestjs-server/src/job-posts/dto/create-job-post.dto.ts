import { IsString, IsUUID, IsOptional, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

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
  modulesRequired?: string;

  @IsString()
  @IsNotEmpty()
  skillsRequired: string;

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

  @IsUUID()
  @IsNotEmpty()
  statusId: string;

  @IsDateString()
  @IsOptional()
  applicationDeadline?: string;

  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @IsUUID()
  @IsOptional()
  updatedBy?: string;
}

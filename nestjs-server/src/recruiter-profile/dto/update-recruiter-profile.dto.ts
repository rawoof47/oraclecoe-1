import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruiterProfileDto } from './create-recruiter-profile.dto';
import { IsArray, IsUUID, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRecruiterProfileDto extends PartialType(CreateRecruiterProfileDto) {
  @IsArray()
  @IsUUID(undefined, { each: true })
  industryIds: string[];

  @IsOptional()
  @IsString()
  @MaxLength(100)
  recruiter_position?: string;  // Add this field
}

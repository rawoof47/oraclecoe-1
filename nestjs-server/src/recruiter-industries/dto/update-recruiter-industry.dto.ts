import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruiterIndustryDto } from './create-recruiter-industry.dto';

export class UpdateRecruiterIndustryDto extends PartialType(CreateRecruiterIndustryDto) {}
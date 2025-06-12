import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateCertificationsBulkDto  } from './create-candidate_certification.dto';

export class UpdateCandidateCertificationDto extends PartialType(CreateCandidateCertificationsBulkDto ) {}

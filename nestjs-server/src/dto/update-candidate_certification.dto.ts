import { PartialType } from '@nestjs/swagger';
import { CreateCandidateCertificationDto } from './create-candidate_certification.dto';

export class UpdateCandidateCertificationDto extends PartialType(CreateCandidateCertificationDto) {}

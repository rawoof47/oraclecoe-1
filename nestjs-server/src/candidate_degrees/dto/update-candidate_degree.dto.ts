import { PartialType } from '@nestjs/swagger';
import { CreateCandidateDegreeDto } from './create-candidate_degree.dto';

export class UpdateCandidateDegreeDto extends PartialType(CreateCandidateDegreeDto) {}

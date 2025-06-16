import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateSkillsBulkDto  } from './create-candidate-skill.dto';

export class UpdateCandidateSkillDto extends PartialType(CreateCandidateSkillsBulkDto ) {}

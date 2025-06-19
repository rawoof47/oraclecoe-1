import { IsUUID } from 'class-validator';

export class CreateCandidateDegreeDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  degree_id: string;
}

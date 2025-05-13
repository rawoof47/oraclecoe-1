import { IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateRecruiterTeamDto {
  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsOptional()
  @IsString()
  team_name?: string;

  @IsOptional()
  @IsString()
  members?: string;
}

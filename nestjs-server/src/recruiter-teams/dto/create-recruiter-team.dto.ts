import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateRecruiterTeamDto {
  @IsUUID()
  owner_id: string;

  @IsString()
  team_name: string;

  @IsOptional()
  @IsString()
  members?: string; // Store JSON string of member IDs, e.g., '["uuid1", "uuid2"]'
}

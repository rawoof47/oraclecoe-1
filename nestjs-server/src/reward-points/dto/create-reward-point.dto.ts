import { IsString, IsInt, IsOptional, IsDate } from 'class-validator';

export class CreateRewardPointsDto {
  @IsString()
  user_id: string;

  @IsInt()
  total_points: number;

  @IsInt()
  lifetime_points: number;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  last_updated?: Date;
}

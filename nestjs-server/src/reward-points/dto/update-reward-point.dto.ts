import { IsString, IsInt, IsOptional, IsDate } from 'class-validator';

export class UpdateRewardPointsDto {
  @IsOptional()
  @IsInt()
  total_points?: number;

  @IsOptional()
  @IsInt()
  lifetime_points?: number;

  @IsOptional()
  @IsDate()
  last_updated?: Date;
}

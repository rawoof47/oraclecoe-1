import { IsString, IsUUID, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateReferralDto {
  @IsUUID()
  referrer_id: string;

  @IsString()
  referral_code: string;

  @IsOptional()
  @IsUUID()
  referred_user_id?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  clicks?: number;

  @IsOptional()
  @IsInt()
  signups?: number;

  @IsOptional()
  @IsBoolean()
  converted?: boolean;

  @IsOptional()
  @IsInt()
  points_awarded?: number;
}

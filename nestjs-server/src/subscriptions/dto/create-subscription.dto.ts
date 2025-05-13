import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  user_id: string;

  @IsString()
  plan_name: string;

  @IsOptional()
  @IsString()
  features?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  payment_reference?: string;
}

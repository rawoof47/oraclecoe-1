import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingDto } from './create-training.dto';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDateString,
    IsNumber,
    IsDecimal,
    IsUrl,
    IsArray
  } from 'class-validator';

export class UpdateTrainingDto extends PartialType(CreateTrainingDto) {

    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsEnum(['online', 'offline', 'hybrid'])
    mode: 'online' | 'offline' | 'hybrid';
  
    @IsDateString()
    start_date: string;
  
    @IsDateString()
    end_date: string;
  
    @IsDateString()
    registration_deadline: string;
  
    @IsNumber()
    fee: number;
  
    @IsNumber()
    @IsNotEmpty()
    batch_size: number; 

    @IsOptional()
    @IsString()
    duration?: string;
  
    @IsOptional()
    @IsString()
    trainer?: string;
  
    @IsOptional()
    @IsString()
    modules?: string;
  
    @IsEnum(['active', 'inactive', 'completed', 'cancelled'])
    @IsOptional()
    status?: 'active' | 'inactive' | 'completed' | 'cancelled';
  
    @IsOptional()
    @IsString()
    pdf_url?: string;
  
    @IsOptional()
    @IsNumber()
    created_by?: number;

    // ✅ New fields
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['technical', 'functional', 'integration'])
  training_type?: 'technical' | 'functional' | 'integration';

  @IsOptional()
  @IsString()
  external_link?: string;

  @IsOptional()
  @IsArray()
  features?: string[];
}

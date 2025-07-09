// src/currency/dto/create-currency.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @Length(3, 3)
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;
}

// src/currency/dto/update-currency.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrencyDto } from './create-currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}

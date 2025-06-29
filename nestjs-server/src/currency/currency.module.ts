// src/currency/currency.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Currency } from './entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])], // ✅ Register the entity here
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService] // Optional: if used elsewhere
})
export class CurrencyModule {}

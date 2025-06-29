// src/currency/entities/currency.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3, unique: true })
  code: string; // e.g., 'USD'

  @Column({ length: 100 })
  name: string; // e.g., 'United States Dollar'

  @Column({ length: 10 })
  symbol: string; // e.g., '$'
}

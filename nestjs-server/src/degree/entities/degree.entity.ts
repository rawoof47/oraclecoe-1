import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DegreeLevel {
  DIPLOMA = 'Diploma',
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
  DOCTORATE = 'Doctorate',
}

@Entity('degrees')
export class Degree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  abbreviation: string;

  @Column({
    type: 'enum',
    enum: DegreeLevel,
  })
  level: DegreeLevel;

  @Column({ length: 100, default: 'Global' })
  country: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}

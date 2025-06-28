import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Region } from '../regions/region.entity';

@Entity('countries')
export class Country {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 5, unique: true })
  code: string;

  @Column({ type: 'char', length: 36 })
  region_id: string;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'region_id' })
  region: Region;
}

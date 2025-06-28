import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('regions')
export class Region {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Degree } from '../../degree/entities/degree.entity';
import { User } from '../../users/entities/user.entity'; // adjust path if needed

@Entity('candidate_degrees')
export class CandidateDegree {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  user_id: string;

  @Column({ type: 'char', length: 36 })
  degree_id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Optional: include relations if needed
  @ManyToOne(() => Degree)
  @JoinColumn({ name: 'degree_id' })
  degree?: Degree;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}

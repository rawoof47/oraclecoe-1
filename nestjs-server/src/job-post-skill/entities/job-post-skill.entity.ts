import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Skill } from 'src/skills/entities/skill.entity';
import { JobPost } from 'src/job-posts/entities/job-post.entity';

@Entity('job_post_skills')
export class JobPostSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  job_post_id: string;

  @Column({ type: 'char', length: 36 })
  skill_id: string;

  @ManyToOne(() => Skill, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;

  @ManyToOne(() => JobPost, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_post_id' })
  jobPost: JobPost;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

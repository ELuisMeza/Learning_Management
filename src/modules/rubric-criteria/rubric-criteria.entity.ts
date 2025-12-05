import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rubric } from '../rubrics/rubrics.entity';

@Entity('rubric_criteria')
export class RubricCriterion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rubric_id', type: 'uuid' })
  rubricId: string;

  @ManyToOne(() => Rubric, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rubric_id' })
  rubric: Rubric;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  weight: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

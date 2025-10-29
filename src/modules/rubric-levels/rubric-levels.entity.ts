import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RubricCriterion } from '../rubric-criteria/rubric-criteria.entity';

@Entity('rubric_levels')
export class RubricLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'criterion_id', type: 'uuid' })
  criterionId: string;

  @ManyToOne(() => RubricCriterion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'criterion_id' })
  criterion: RubricCriterion;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

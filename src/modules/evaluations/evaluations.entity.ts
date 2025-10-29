import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../classes/classes.entity';
import { EvaluationType } from '../evaluation-types/evaluation-types.entity';
import { Rubric } from '../rubrics/rubrics.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id', type: 'uuid' })
  classId: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'evaluation_mode', type: 'varchar', default: 'teacher' })
  evaluationMode: string;

  @Column({ name: 'evaluation_type_id', type: 'uuid' })
  evaluationTypeId: string;

  @ManyToOne(() => EvaluationType)
  @JoinColumn({ name: 'evaluation_type_id' })
  evaluationType: EvaluationType;

  @Column({ name: 'rubric_id', type: 'uuid', nullable: true })
  rubricId: string;

  @ManyToOne(() => Rubric, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rubric_id' })
  rubric: Rubric;

  @Column({ name: 'max_score', type: 'decimal', precision: 5, scale: 2, default: 100 })
  maxScore: number;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'varchar', default: 'activo' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}

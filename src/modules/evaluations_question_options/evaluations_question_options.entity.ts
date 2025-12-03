import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EvaluationQuestion } from '../evaluations_questions/evaluations_questions.entity';

@Entity('evaluations_question_options')
export class EvaluationQuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => EvaluationQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: EvaluationQuestion;

  @Column({ type: 'text' })
  label: string;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}


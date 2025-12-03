import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { EvaluationQuestion } from '../evaluations_questions/evaluations_questions.entity';
import { EvaluationQuestionOption } from '../evaluations_question_options/evaluations_question_options.entity';

@Entity('evaluation_answers')
export class EvaluationAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @ManyToOne(() => EvaluationQuestion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: EvaluationQuestion;

  @Column({ name: 'option_id', type: 'uuid' })
  optionId: string;

  @ManyToOne(() => EvaluationQuestionOption, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_id' })
  option: EvaluationQuestionOption;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}


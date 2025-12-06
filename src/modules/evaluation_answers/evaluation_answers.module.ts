import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationAnswersService } from './evaluation_answers.service';
import { EvaluationAnswersController } from './evaluation_answers.controller';
import { EvaluationAnswer } from './evaluation_answers.entity';
import { EvaluationQuestion } from '../evaluations_questions/evaluations_questions.entity';
import { EvaluationQuestionOption } from '../evaluations_question_options/evaluations_question_options.entity';
import { EvaluationsQuestionsModule } from '../evaluations_questions/evaluations_questions.module';
import { EvaluationsModule } from '../evaluations/evaluations.module';
import { EvaluationResultsModule } from '../evaluation-results/evaluation-results.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationAnswer, EvaluationQuestion, EvaluationQuestionOption]),
    EvaluationsQuestionsModule,
    EvaluationsModule,
    EvaluationResultsModule,
    UsersModule,
  ],
  controllers: [EvaluationAnswersController],
  providers: [EvaluationAnswersService],
  exports: [EvaluationAnswersService],
})
export class EvaluationAnswersModule {}

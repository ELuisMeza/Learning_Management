import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsQuestionsService } from './evaluations_questions.service';
import { EvaluationsQuestionsController } from './evaluations_questions.controller';
import { EvaluationQuestion } from './evaluations_questions.entity';
import { EvaluationQuestionOption } from '../evaluations_question_options/evaluations_question_options.entity';
import { Evaluation } from '../evaluations/evaluations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationQuestion, EvaluationQuestionOption, Evaluation]),
  ],
  controllers: [EvaluationsQuestionsController],
  providers: [EvaluationsQuestionsService],
  exports: [EvaluationsQuestionsService],
})
export class EvaluationsQuestionsModule {}

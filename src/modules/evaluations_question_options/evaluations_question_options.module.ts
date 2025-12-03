import { Module } from '@nestjs/common';
import { EvaluationsQuestionOptionsService } from './evaluations_question_options.service';
import { EvaluationsQuestionOptionsController } from './evaluations_question_options.controller';

@Module({
  controllers: [EvaluationsQuestionOptionsController],
  providers: [EvaluationsQuestionOptionsService],
})
export class EvaluationsQuestionOptionsModule {}

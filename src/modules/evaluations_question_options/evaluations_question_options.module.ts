import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsQuestionOptionsService } from './evaluations_question_options.service';
import { EvaluationsQuestionOptionsController } from './evaluations_question_options.controller';
import { EvaluationQuestionOption } from './evaluations_question_options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationQuestionOption])],
  controllers: [EvaluationsQuestionOptionsController],
  providers: [EvaluationsQuestionOptionsService],
  exports: [EvaluationsQuestionOptionsService],
})
export class EvaluationsQuestionOptionsModule {}

import { Module } from '@nestjs/common';
import { EvaluationAnswersService } from './evaluation_answers.service';
import { EvaluationAnswersController } from './evaluation_answers.controller';

@Module({
  controllers: [EvaluationAnswersController],
  providers: [EvaluationAnswersService],
})
export class EvaluationAnswersModule {}

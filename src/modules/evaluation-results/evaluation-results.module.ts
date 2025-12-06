import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationResultsService } from './evaluation-results.service';
import { EvaluationResultsController } from './evaluation-results.controller';
import { EvaluationResult } from './evaluation-results.entity';
import { EvaluationsModule } from '../evaluations/evaluations.module';
import { UsersModule } from '../users/users.module';
import { RubricCriterion } from '../rubric-criteria/rubric-criteria.entity';
import { RubricLevel } from '../rubric-levels/rubric-levels.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationResult, RubricCriterion, RubricLevel]),
    forwardRef(() => EvaluationsModule),
    UsersModule,
  ],
  providers: [EvaluationResultsService],
  controllers: [EvaluationResultsController],
  exports: [EvaluationResultsService],
})
export class EvaluationResultsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationResultsService } from './evaluation-results.service';
import { EvaluationResultsController } from './evaluation-results.controller';
import { EvaluationResult } from './evaluation-results.entity';
import { EvaluationsModule } from '../evaluations/evaluations.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationResult]), EvaluationsModule, UsersModule],
  providers: [EvaluationResultsService],
  controllers: [EvaluationResultsController],
  exports: [EvaluationResultsService],
})
export class EvaluationResultsModule {}

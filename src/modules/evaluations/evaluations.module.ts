import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './evaluations.entity';
import { ClassesModule } from '../classes/classes.module';
import { EvaluationTypesModule } from '../evaluation-types/evaluation-types.module';
import { RubricsModule } from '../rubrics/rubrics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation]), ClassesModule, EvaluationTypesModule, RubricsModule],
  providers: [EvaluationsService],
  controllers: [EvaluationsController],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './evaluations.entity';
import { RubricLevel } from '../rubric-levels/rubric-levels.entity';
import { ClassesModule } from '../classes/classes.module';
import { EvaluationTypesModule } from '../evaluation-types/evaluation-types.module';
import { RubricsModule } from '../rubrics/rubrics.module';
import { UsersModule } from '../users/users.module';
import { ClassStudentsModule } from '../class-students/class-students.module';
import { EvaluationResultsModule } from '../evaluation-results/evaluation-results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, RubricLevel]),
    ClassesModule,
    EvaluationTypesModule,
    RubricsModule,
    UsersModule,
    ClassStudentsModule,
    forwardRef(() => EvaluationResultsModule),
  ],
  providers: [EvaluationsService],
  controllers: [EvaluationsController],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricCriteriaService } from './rubric-criteria.service';
import { RubricCriteriaController } from './rubric-criteria.controller';
import { RubricCriterion } from './rubric-criteria.entity';
import { RubricsModule } from '../rubrics/rubrics.module';

@Module({
  imports: [TypeOrmModule.forFeature([RubricCriterion]), RubricsModule],
  providers: [RubricCriteriaService],
  controllers: [RubricCriteriaController],
  exports: [RubricCriteriaService],
})
export class RubricCriteriaModule {}

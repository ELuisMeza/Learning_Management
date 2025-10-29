import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricLevelsService } from './rubric-levels.service';
import { RubricLevelsController } from './rubric-levels.controller';
import { RubricLevel } from './rubric-levels.entity';
import { RubricCriteriaModule } from '../rubric-criteria/rubric-criteria.module';

@Module({
  imports: [TypeOrmModule.forFeature([RubricLevel]), RubricCriteriaModule],
  providers: [RubricLevelsService],
  controllers: [RubricLevelsController],
  exports: [RubricLevelsService],
})
export class RubricLevelsModule {}

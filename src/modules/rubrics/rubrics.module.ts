import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubricsService } from './rubrics.service';
import { RubricsController } from './rubrics.controller';
import { Rubric } from './rubrics.entity';
import { UsersModule } from '../users/users.module';
import { RubricCriteriaModule } from '../rubric-criteria/rubric-criteria.module';
import { RubricLevelsModule } from '../rubric-levels/rubric-levels.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rubric]),
    UsersModule,
    forwardRef(() => RubricCriteriaModule),
    forwardRef(() => RubricLevelsModule),
  ],
  providers: [RubricsService],
  controllers: [RubricsController],
  exports: [RubricsService],
})
export class RubricsModule {}

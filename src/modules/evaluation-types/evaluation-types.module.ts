import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationTypesService } from './evaluation-types.service';
import { EvaluationTypesController } from './evaluation-types.controller';
import { EvaluationType } from './evaluation-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationType])],
  providers: [EvaluationTypesService],
  controllers: [EvaluationTypesController],
  exports: [EvaluationTypesService],
})
export class EvaluationTypesModule {}

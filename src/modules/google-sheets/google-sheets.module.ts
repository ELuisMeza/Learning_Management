import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { GoogleSheetsController } from './google-sheets.controller';
import { EvaluationResultsModule } from '../evaluation-results/evaluation-results.module';
import { EvaluationsModule } from '../evaluations/evaluations.module';

@Module({
  imports: [EvaluationResultsModule, EvaluationsModule],
  providers: [GoogleSheetsService],
  controllers: [GoogleSheetsController],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}


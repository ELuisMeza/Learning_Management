import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EvaluationResultsService } from './evaluation-results.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('evaluation-results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationResultsController {
  constructor(private readonly evaluationResultsService: EvaluationResultsService) {}

  @Get(':evaluationId/results')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener resultados de una evaluación' })
  @ApiParam({ name: 'evaluationId', type: String })
  async getResultsByEvaluationId(@Param('evaluationId', ParseUUIDPipe) evaluationId: string) {
    return this.evaluationResultsService.getResultsByEvaluationId(evaluationId);
  }
}

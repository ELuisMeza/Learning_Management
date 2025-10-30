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
@Controller('evaluation-results')
export class EvaluationResultsController {
  constructor(private readonly evaluationResultsService: EvaluationResultsService) {}

}

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
} from '@nestjs/common';
import { EvaluationTypesService } from './evaluation-types.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('evaluation-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluation-types')
export class EvaluationTypesController {
  constructor(private readonly evaluationTypesService: EvaluationTypesService) {}

}

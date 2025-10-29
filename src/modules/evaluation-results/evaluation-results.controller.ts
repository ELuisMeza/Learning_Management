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
import { CreateEvaluationResultDto } from './dto/create-evaluation-result.dto';
import { UpdateEvaluationResultDto } from './dto/update-evaluation-result.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('evaluation-results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluation-results')
export class EvaluationResultsController {
  constructor(private readonly evaluationResultsService: EvaluationResultsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear resultado de evaluación' })
  @ApiCreatedResponse({ description: 'Resultado de evaluación creado' })
  create(@Body() createEvaluationResultDto: CreateEvaluationResultDto) {
    return this.evaluationResultsService.create(createEvaluationResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar resultados de evaluaciones' })
  @ApiOkResponse({ description: 'Listado de resultados' })
  findAll() {
    return this.evaluationResultsService.findAll();
  }

  @Get(':evaluationId/:studentId')
  @ApiOperation({ summary: 'Obtener resultado por ids' })
  @ApiOkResponse({ description: 'Resultado encontrado' })
  @ApiParam({ name: 'evaluationId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  findOne(
    @Param('evaluationId', ParseUUIDPipe) evaluationId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.evaluationResultsService.findByEvaluationAndStudent(evaluationId, studentId);
  }

  @Patch(':evaluationId/:studentId')
  @ApiOperation({ summary: 'Actualizar resultado' })
  @ApiOkResponse({ description: 'Resultado actualizado' })
  @ApiParam({ name: 'evaluationId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  update(
    @Param('evaluationId', ParseUUIDPipe) evaluationId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() updateEvaluationResultDto: UpdateEvaluationResultDto,
  ) {
    return this.evaluationResultsService.update(
      evaluationId,
      studentId,
      updateEvaluationResultDto,
    );
  }

  @Delete(':evaluationId/:studentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar resultado' })
  @ApiNoContentResponse({ description: 'Resultado eliminado' })
  @ApiParam({ name: 'evaluationId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  remove(
    @Param('evaluationId', ParseUUIDPipe) evaluationId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.evaluationResultsService.remove(evaluationId, studentId);
  }
}

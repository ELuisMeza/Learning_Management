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
  Req,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import { GetEvaluationsDto } from './dto/get.dto';
import { SubmitRubricDto } from './dto/submit-rubric.dto';
import { ApiParam } from '@nestjs/swagger';

@ApiTags('evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post('get-mine-teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener evaluaciones del docente autenticado' })
  @ApiOkResponse({ description: 'Evaluaciones obtenidas' })
  @ApiBody({ type: GetEvaluationsDto })
  async getMineTeacher(@Req() req: RequestWithUser, @Body() getEvaluationsDto: GetEvaluationsDto) {
    return this.evaluationsService.getMineTeacher(req.user.userId, getEvaluationsDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear evaluación' })
  @ApiCreatedResponse({ description: 'Evaluación creada' })
  async create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationsService.create(createEvaluationDto);
  }

  @Get('my-evaluations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener evaluaciones del estudiante autenticado' })
  @ApiOkResponse({ description: 'Evaluaciones obtenidas' })
  async getMyEvaluations(@Req() req: RequestWithUser) {
    return this.evaluationsService.getMyEvaluations(req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener evaluación por ID' })
  @ApiOkResponse({ description: 'Evaluación obtenida' })
  @ApiParam({ name: 'id', type: String })
  async getById(@Param('id') id: string) {
    return this.evaluationsService.getByIdWithRelations(id);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar evaluación con rúbrica' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: SubmitRubricDto })
  async submitEvaluation(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Body() submitRubricDto: SubmitRubricDto,
  ) {
    return this.evaluationsService.submitRubricEvaluation(id, req.user.userId, submitRubricDto);
  }
}

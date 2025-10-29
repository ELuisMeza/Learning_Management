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
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear evaluación' })
  @ApiCreatedResponse({ description: 'Evaluación creada' })
  create(@Body() createEvaluationDto: CreateEvaluationDto) {
    return this.evaluationsService.create(createEvaluationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar evaluaciones' })
  @ApiOkResponse({ description: 'Listado de evaluaciones' })
  findAll() {
    return this.evaluationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evaluación por id' })
  @ApiOkResponse({ description: 'Evaluación encontrada' })
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evaluación' })
  @ApiOkResponse({ description: 'Evaluación actualizada' })
  update(@Param('id') id: string, @Body() updateEvaluationDto: UpdateEvaluationDto) {
    return this.evaluationsService.update(id, updateEvaluationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar evaluación' })
  @ApiNoContentResponse({ description: 'Evaluación eliminada' })
  remove(@Param('id') id: string) {
    return this.evaluationsService.remove(id);
  }
}

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
import { CreateEvaluationTypeDto } from './dto/create-evaluation-type.dto';
import { UpdateEvaluationTypeDto } from './dto/update-evaluation-type.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('evaluation-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluation-types')
export class EvaluationTypesController {
  constructor(private readonly evaluationTypesService: EvaluationTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tipo de evaluación' })
  @ApiCreatedResponse({ description: 'Tipo de evaluación creado' })
  create(@Body() createEvaluationTypeDto: CreateEvaluationTypeDto) {
    return this.evaluationTypesService.create(createEvaluationTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de evaluación' })
  @ApiOkResponse({ description: 'Listado de tipos de evaluación' })
  findAll() {
    return this.evaluationTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de evaluación por id' })
  @ApiOkResponse({ description: 'Tipo de evaluación encontrado' })
  findOne(@Param('id') id: string) {
    return this.evaluationTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de evaluación' })
  @ApiOkResponse({ description: 'Tipo de evaluación actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateEvaluationTypeDto: UpdateEvaluationTypeDto,
  ) {
    return this.evaluationTypesService.update(id, updateEvaluationTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar tipo de evaluación' })
  @ApiNoContentResponse({ description: 'Tipo de evaluación eliminado' })
  remove(@Param('id') id: string) {
    return this.evaluationTypesService.remove(id);
  }
}

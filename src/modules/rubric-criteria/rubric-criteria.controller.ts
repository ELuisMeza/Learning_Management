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
import { RubricCriteriaService } from './rubric-criteria.service';
import { CreateRubricCriterionDto } from './dto/create-rubric-criterion.dto';
import { UpdateRubricCriterionDto } from './dto/update-rubric-criterion.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rubric-criteria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rubric-criteria')
export class RubricCriteriaController {
  constructor(private readonly rubricCriteriaService: RubricCriteriaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear criterio de rúbrica' })
  @ApiCreatedResponse({ description: 'Criterio creado' })
  create(@Body() createRubricCriterionDto: CreateRubricCriterionDto) {
    return this.rubricCriteriaService.create(createRubricCriterionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar criterios de rúbrica' })
  @ApiOkResponse({ description: 'Listado de criterios' })
  findAll() {
    return this.rubricCriteriaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener criterio por id' })
  @ApiOkResponse({ description: 'Criterio encontrado' })
  findOne(@Param('id') id: string) {
    return this.rubricCriteriaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar criterio' })
  @ApiOkResponse({ description: 'Criterio actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateRubricCriterionDto: UpdateRubricCriterionDto,
  ) {
    return this.rubricCriteriaService.update(id, updateRubricCriterionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar criterio' })
  @ApiNoContentResponse({ description: 'Criterio eliminado' })
  remove(@Param('id') id: string) {
    return this.rubricCriteriaService.remove(id);
  }
}

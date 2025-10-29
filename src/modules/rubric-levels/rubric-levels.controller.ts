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
import { RubricLevelsService } from './rubric-levels.service';
import { CreateRubricLevelDto } from './dto/create-rubric-level.dto';
import { UpdateRubricLevelDto } from './dto/update-rubric-level.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rubric-levels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rubric-levels')
export class RubricLevelsController {
  constructor(private readonly rubricLevelsService: RubricLevelsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nivel de rúbrica' })
  @ApiCreatedResponse({ description: 'Nivel de rúbrica creado' })
  create(@Body() createRubricLevelDto: CreateRubricLevelDto) {
    return this.rubricLevelsService.create(createRubricLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar niveles de rúbrica' })
  @ApiOkResponse({ description: 'Listado de niveles' })
  findAll() {
    return this.rubricLevelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener nivel por id' })
  @ApiOkResponse({ description: 'Nivel encontrado' })
  findOne(@Param('id') id: string) {
    return this.rubricLevelsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar nivel de rúbrica' })
  @ApiOkResponse({ description: 'Nivel de rúbrica actualizado' })
  update(@Param('id') id: string, @Body() updateRubricLevelDto: UpdateRubricLevelDto) {
    return this.rubricLevelsService.update(id, updateRubricLevelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar nivel de rúbrica' })
  @ApiNoContentResponse({ description: 'Nivel de rúbrica eliminado' })
  remove(@Param('id') id: string) {
    return this.rubricLevelsService.remove(id);
  }
}

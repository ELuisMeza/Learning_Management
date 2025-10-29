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
import { AcademicCyclesService } from './academic-cycles.service';
import { CreateAcademicCycleDto } from './dto/create-academic-cycle.dto';
import { UpdateAcademicCycleDto } from './dto/update-academic-cycle.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('academic-cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic-cycles')
export class AcademicCyclesController {
  constructor(private readonly academicCyclesService: AcademicCyclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear ciclo académico' })
  @ApiCreatedResponse({ description: 'Ciclo académico creado' })
  create(@Body() createAcademicCycleDto: CreateAcademicCycleDto) {
    return this.academicCyclesService.create(createAcademicCycleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ciclos académicos' })
  @ApiOkResponse({ description: 'Listado de ciclos académicos' })
  findAll() {
    return this.academicCyclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ciclo académico por id' })
  @ApiOkResponse({ description: 'Ciclo académico encontrado' })
  findOne(@Param('id') id: string) {
    return this.academicCyclesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ciclo académico' })
  @ApiOkResponse({ description: 'Ciclo académico actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateAcademicCycleDto: UpdateAcademicCycleDto,
  ) {
    return this.academicCyclesService.update(id, updateAcademicCycleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar ciclo académico' })
  @ApiNoContentResponse({ description: 'Ciclo académico eliminado' })
  remove(@Param('id') id: string) {
    return this.academicCyclesService.remove(id);
  }
}

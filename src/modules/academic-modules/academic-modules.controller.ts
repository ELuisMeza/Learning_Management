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
import { AcademicModulesService } from './academic-modules.service';
import { CreateAcademicModuleDto } from './dto/create-academic-module.dto';
import { UpdateAcademicModuleDto } from './dto/update-academic-module.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('academic-modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic-modules')
export class AcademicModulesController {
  constructor(private readonly academicModulesService: AcademicModulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear módulo académico' })
  @ApiCreatedResponse({ description: 'Módulo académico creado' })
  create(@Body() createAcademicModuleDto: CreateAcademicModuleDto) {
    return this.academicModulesService.create(createAcademicModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar módulos académicos' })
  @ApiOkResponse({ description: 'Listado de módulos académicos' })
  findAll() {
    return this.academicModulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener módulo académico por id' })
  @ApiOkResponse({ description: 'Módulo académico encontrado' })
  findOne(@Param('id') id: string) {
    return this.academicModulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar módulo académico' })
  @ApiOkResponse({ description: 'Módulo académico actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateAcademicModuleDto: UpdateAcademicModuleDto,
  ) {
    return this.academicModulesService.update(id, updateAcademicModuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar módulo académico' })
  @ApiNoContentResponse({ description: 'Módulo académico eliminado' })
  remove(@Param('id') id: string) {
    return this.academicModulesService.remove(id);
  }
}

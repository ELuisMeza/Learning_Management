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
  Put,
} from '@nestjs/common';
import { AcademicModulesService } from './academic-modules.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAcademicModuleDto } from './dto/create-module.dto';
import { AcademicModule } from './academic-modules.entity';
import { UpdateAcademicModuleDto } from './dto/update-module.dto';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { GetModulesDto } from './dto/get-modules.dto';

@ApiTags('academic-modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic-modules')
export class AcademicModulesController {
  constructor(private readonly academicModulesService: AcademicModulesService) {}


  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los módulos académicos con paginación y búsqueda' })
  @ApiBody({ type: GetModulesDto })
  @ApiOkResponse({ description: 'Listado paginado de módulos académicos' })
  getAll(@Body() getAllDto: GetModulesDto) {
    return this.academicModulesService.getAll(getAllDto);
  }

  @Get('by-cycle/:cycleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener módulos académicos por ID de ciclo' })
  @ApiOkResponse({ description: 'Módulos académicos obtenidos exitosamente' })
  getByCycleId(@Param('cycleId') cycleId: string) {
    return this.academicModulesService.getByCycleId(cycleId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un módulo académico' })
  @ApiCreatedResponse({ description: 'Módulo académico creado exitosamente' })
  @ApiBody({ type: CreateAcademicModuleDto })
  async create(@Body() createAcademicModuleDto: CreateAcademicModuleDto): Promise<AcademicModule> {
    return await this.academicModulesService.create(createAcademicModuleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un módulo académico' })
  @ApiOkResponse({ description: 'Módulo académico actualizado exitosamente' })
  @ApiBody({ type: UpdateAcademicModuleDto })
  async update(@Param('id') id: string, @Body() updateAcademicModuleDto: UpdateAcademicModuleDto): Promise<AcademicModule> {
    return await this.academicModulesService.update(id, updateAcademicModuleDto);
  }
}

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
import { AcademicCyclesService } from './academic-cycles.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAcademicCycleDto } from './dto/create-cycles.dto';
import { UpdateAcademicCycleDto } from './dto/update-cycles';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';

@ApiTags('academic-cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic-cycles')
export class AcademicCyclesController {
  constructor(private readonly academicCyclesService: AcademicCyclesService) {}
  
  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los ciclos académicos con paginación y búsqueda' })
  @ApiBody({ type: BasePayloadGetDto })
  @ApiOkResponse({ description: 'Listado paginado de ciclos académicos' })
  getAll(@Body() getAllDto: BasePayloadGetDto) {
    return this.academicCyclesService.getAll(getAllDto);
  }


  @Get('by-career/:careerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar ciclos académicos por ID de carrera' })
  @ApiOkResponse({ description: 'Listado de ciclos académicos por ID de carrera' })
  getByCareerId(@Param('careerId') careerId: string) {
      return this.academicCyclesService.getByCareerId(careerId);
    }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear ciclo académico' })
  @ApiCreatedResponse({ description: 'Ciclo académico creado' })
  create(@Body() createAcademicCycleDto: CreateAcademicCycleDto) {
    return this.academicCyclesService.create(createAcademicCycleDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar ciclo académico' })
  @ApiOkResponse({ description: 'Ciclo académico actualizado' })
  update(@Param('id') id: string, @Body() updateAcademicCycleDto: UpdateAcademicCycleDto) {
    return this.academicCyclesService.update(id, updateAcademicCycleDto);
  }
}

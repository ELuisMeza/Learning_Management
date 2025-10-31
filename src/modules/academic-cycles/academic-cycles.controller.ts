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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAcademicCycleDto } from './dto/create-cycles.dto';
import { UpdateAcademicCycleDto } from './dto/update-cycles';

@ApiTags('academic-cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic-cycles')
export class AcademicCyclesController {
  constructor(private readonly academicCyclesService: AcademicCyclesService) {}
  
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

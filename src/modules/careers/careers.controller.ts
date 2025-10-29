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
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('careers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear carrera' })
  @ApiCreatedResponse({ description: 'Carrera creada' })
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careersService.create(createCareerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar carreras' })
  @ApiOkResponse({ description: 'Listado de carreras' })
  findAll() {
    return this.careersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrera por id' })
  @ApiOkResponse({ description: 'Carrera encontrada' })
  findOne(@Param('id') id: string) {
    return this.careersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrera' })
  @ApiOkResponse({ description: 'Carrera actualizada' })
  update(@Param('id') id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careersService.update(id, updateCareerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar carrera' })
  @ApiNoContentResponse({ description: 'Carrera eliminada' })
  remove(@Param('id') id: string) {
    return this.careersService.remove(id);
  }
}

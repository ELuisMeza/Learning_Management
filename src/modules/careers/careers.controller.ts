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
import { CareersService } from './careers.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';

@ApiTags('careers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}
  
  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar carreras con paginación y búsqueda' })
  @ApiBody({ type: BasePayloadGetDto })
  @ApiOkResponse({ description: 'Listado paginado de carreras' })
  getAll(@Body() getAllDto: BasePayloadGetDto) {
    return this.careersService.findAll(getAllDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear carrera' })
  @ApiCreatedResponse({ description: 'Carrera creada' })
  create(@Body() createCareerDto: CreateCareerDto) {
    return this.careersService.create(createCareerDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar carrera' })
  @ApiOkResponse({ description: 'Carrera actualizada' })
  update(@Param('id') id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.careersService.update(id, updateCareerDto);
  }
}

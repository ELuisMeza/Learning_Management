import {Controller, HttpCode, HttpStatus, Body, Post } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { CreateUpdateTeacherDto } from './dto/create-teacher.dto';
import { GetTeachersDto } from './dto/get-teachers.dto';

@ApiTags('teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los profesores con paginación y búsqueda' })
  @ApiBody({ type: GetTeachersDto })
  @ApiOkResponse({ description: 'Listado paginado de profesores' })
  getAll(@Body() getAllDto: GetTeachersDto) {
    return this.teachersService.getAll(getAllDto);
  }

}

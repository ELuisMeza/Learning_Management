import { Controller, HttpStatus, HttpCode, Post, UseGuards, Param, Get, Put } from '@nestjs/common';
import { ClassSchedulesService } from './class_schedules.service';
import { CreateScheduleDto } from './dto/create-shedule.dto';
import { ApiOperation, ApiCreatedResponse, ApiBody, ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('class-schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('class-schedules')
export class ClassSchedulesController {
  constructor(private readonly classSchedulesService: ClassSchedulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear horario de clase' })
  @ApiCreatedResponse({ description: 'Horario de clase creado' })
  @ApiBody({ type: CreateScheduleDto })
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.classSchedulesService.create(createScheduleDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar horario de clase' })
  @ApiOkResponse({ description: 'Horario de clase actualizado' })
  @ApiBody({ type: UpdateScheduleDto })
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.classSchedulesService.update(id, updateScheduleDto);
  }

  @Get('by-class/:classId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener horarios de clase por ID de clase' })
  @ApiOkResponse({ description: 'Horarios de clase obtenidos' })
  getAllByClassId(@Param('classId') classId: string) {
    return this.classSchedulesService.getAllByClassId(classId);
  }
  
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener horario de clase por ID' })
  @ApiOkResponse({ description: 'Horario de clase obtenido' })
  getById(@Param('id') id: string) {
    return this.classSchedulesService.getByIdAndActive(id);
  }

}

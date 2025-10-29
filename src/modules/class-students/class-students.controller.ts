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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClassStudentsService } from './class-students.service';
import { CreateClassStudentDto } from './dto/create-class-student.dto';
import { UpdateClassStudentDto } from './dto/update-class-student.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('class-students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('class-students')
export class ClassStudentsController {
  constructor(private readonly classStudentsService: ClassStudentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear relación clase-estudiante' })
  @ApiCreatedResponse({ description: 'Relación creada' })
  create(@Body() createClassStudentDto: CreateClassStudentDto) {
    return this.classStudentsService.create(createClassStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar relaciones clase-estudiante' })
  @ApiOkResponse({ description: 'Listado de relaciones' })
  findAll() {
    return this.classStudentsService.findAll();
  }

  @Get(':classId/:studentId')
  @ApiOperation({ summary: 'Obtener relación por ids' })
  @ApiOkResponse({ description: 'Relación encontrada' })
  @ApiParam({ name: 'classId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  findOne(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classStudentsService.findByClassAndStudent(classId, studentId);
  }

  @Patch(':classId/:studentId')
  @ApiOperation({ summary: 'Actualizar relación' })
  @ApiOkResponse({ description: 'Relación actualizada' })
  @ApiParam({ name: 'classId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  update(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() updateClassStudentDto: UpdateClassStudentDto,
  ) {
    return this.classStudentsService.update(classId, studentId, updateClassStudentDto);
  }

  @Delete(':classId/:studentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar relación' })
  @ApiNoContentResponse({ description: 'Relación eliminada' })
  @ApiParam({ name: 'classId', type: 'string' })
  @ApiParam({ name: 'studentId', type: 'string' })
  remove(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classStudentsService.remove(classId, studentId);
  }
}

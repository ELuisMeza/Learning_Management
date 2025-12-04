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
  Req,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import { ClassStudentsService } from '../class-students/class-students.service';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { GetClassesByTeacherIdDto, GetClassesDto } from './dto/get-clasees.dto';

@ApiTags('classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly classStudentsService: ClassStudentsService,
  ) {}

  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas las clases con paginación y búsqueda' })
  @ApiBody({ type: GetClassesDto })
  @ApiOkResponse({ description: 'Listado paginado de clases' })
  getAll(@Body() getAllDto: GetClassesDto) {
    return this.classesService.getAll(getAllDto);
  }

  
  @Post('get-all-by-teacher')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las clases del docente autenticado' })
  @ApiBody({ type: GetClassesByTeacherIdDto })
  @ApiOkResponse({ description: 'Listado de clases del docente' })
  getAllByTeacherId(@Body() getAllByTeacherIdDto: GetClassesByTeacherIdDto, @Req() req: RequestWithUser) {
    return this.classesService.getAllByTeacherId(getAllByTeacherIdDto, req.user.userId);
  }
  
  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener clase por código' })
  @ApiOkResponse({ description: 'Clase encontrada' })
  @ApiParam({ name: 'code', description: 'Código de la clase' })
  async getByCode(@Param('code') code: string) {
    return await this.classesService.getByCode(code);
  }
  
  @Get('by-module/:moduleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar clases por módulo' })
  @ApiOkResponse({ description: 'Listado de clases' })
  getAllByModuleId(@Param('moduleId') moduleId: string) {
    return this.classesService.getAllByModuleId(moduleId);
  }
  
  @Get(':id/qr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generar código QR de la clase' })
  @ApiOkResponse({ description: 'Código QR generado exitosamente' })
  @ApiParam({ name: 'id', description: 'ID de la clase' })
  async getQRCode(@Param('id') id: string) {
    return await this.classesService.generateQRCode(id);
  }
  
  @Get(':id/students')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener estudiantes de una clase' })
  @ApiOkResponse({ description: 'Listado de estudiantes' })
  @ApiParam({ name: 'id', description: 'ID de la clase' })
  async getClassStudents(@Param('id') classId: string) {
    return await this.classStudentsService.getStudentsByClassId(classId);
  }
  
  @Post(':id/enroll')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscribir estudiante a una clase' })
  @ApiCreatedResponse({ description: 'Estudiante inscrito exitosamente' })
  @ApiParam({ name: 'id', description: 'ID de la clase' })
  async enrollStudent(@Param('id') classId: string, @Req() req: RequestWithUser) {
    return await this.classStudentsService.matriculateStudentByQR(classId, req.user.userId);
  }
  
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener clase por ID' })
  @ApiOkResponse({ description: 'Clase encontrada' })
  @ApiParam({ name: 'id', description: 'ID de la clase' })
  async getById(@Param('id') id: string) {
    return await this.classesService.getByIdAndActive(id);
  }
  
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar clase' })
  @ApiOkResponse({ description: 'Clase actualizada' })
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear clase' })
  @ApiCreatedResponse({ description: 'Clase creada' })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }
}
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
import { ClassesService } from './classes.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear clase' })
  @ApiCreatedResponse({ description: 'Clase creada' })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get('by-module/:moduleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar clases' })
  @ApiOkResponse({ description: 'Listado de clases' })
  getAllByModuleId(@Param('moduleId') moduleId: string) {
    return this.classesService.getAllByModuleId(moduleId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar clase' })
  @ApiOkResponse({ description: 'Clase actualizada' })
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Get(':id/qr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generar código QR de la clase' })
  @ApiOkResponse({ description: 'Código QR generado exitosamente' })
  async getQRCode(@Param('id') id: string) {
    return await this.classesService.generateQRCode(id);
  }
}

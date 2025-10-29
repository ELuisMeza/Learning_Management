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
import { RubricsService } from './rubrics.service';
import { CreateRubricDto } from './dto/create-rubric.dto';
import { UpdateRubricDto } from './dto/update-rubric.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rubrics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rubrics')
export class RubricsController {
  constructor(private readonly rubricsService: RubricsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear rúbrica' })
  @ApiCreatedResponse({ description: 'Rúbrica creada' })
  create(@Body() createRubricDto: CreateRubricDto) {
    return this.rubricsService.create(createRubricDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar rúbricas' })
  @ApiOkResponse({ description: 'Listado de rúbricas' })
  findAll() {
    return this.rubricsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rúbrica por id' })
  @ApiOkResponse({ description: 'Rúbrica encontrada' })
  findOne(@Param('id') id: string) {
    return this.rubricsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar rúbrica' })
  @ApiOkResponse({ description: 'Rúbrica actualizada' })
  update(@Param('id') id: string, @Body() updateRubricDto: UpdateRubricDto) {
    return this.rubricsService.update(id, updateRubricDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar rúbrica' })
  @ApiNoContentResponse({ description: 'Rúbrica eliminada' })
  remove(@Param('id') id: string) {
    return this.rubricsService.remove(id);
  }
}

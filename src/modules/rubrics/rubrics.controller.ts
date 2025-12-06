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
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RubricsService } from './rubrics.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRubricDto } from './dto/create.dto';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
@ApiTags('rubrics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rubrics')
export class RubricsController {
  constructor(private readonly rubricsService: RubricsService) {}

  @Post('get-by-creator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener rubricas por usuario creador con paginación y filtros' })
  @ApiOkResponse({ description: 'Rubricas obtenidas' })
  @ApiBody({ type: BasePayloadGetDto })
  async getByUserCreator(
    @Req() req: RequestWithUser,
    @Body() getRubricsDto: BasePayloadGetDto,
  ) {
    return this.rubricsService.getByUserCreator(req.user.userId, getRubricsDto);
  }

  @Get('get-by-id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener rubrica por id' })
  @ApiOkResponse({ description: 'Rubrica obtenida' })
  async getById(@Param('id') id: string) {
    return this.rubricsService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear rubrica' })
  @ApiCreatedResponse({ description: 'Rubrica creada' })
  create(@Body() createRubricDto: CreateRubricDto, @Req() req: RequestWithUser) {
    return this.rubricsService.create(createRubricDto, req.user.userId);
  }

  @Post('upload-excel')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir rúbrica desde archivo Excel' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Rúbrica creada desde Excel exitosamente' })
  async uploadFromExcel(
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype?: string } | undefined,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar extensión del archivo
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      throw new BadRequestException('El archivo debe ser un Excel (.xlsx o .xls)');
    }

    return this.rubricsService.createFromExcel(file, req.user.userId);
  }
}

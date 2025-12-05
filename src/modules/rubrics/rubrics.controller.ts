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
} from '@nestjs/common';
import { RubricsService } from './rubrics.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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


}

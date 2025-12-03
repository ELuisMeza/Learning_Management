import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EvaluationsQuestionsService } from './evaluations_questions.service';
import { CreateFormDto } from './dto/create-form.dto';

@ApiTags('evaluations-questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations-questions')
export class EvaluationsQuestionsController {
  constructor(private readonly evaluationsQuestionsService: EvaluationsQuestionsService) {}

  @Post('create-form')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear formulario de evaluación con preguntas y opciones' })
  @ApiBody({ type: CreateFormDto })
  @ApiCreatedResponse({ description: 'Formulario creado exitosamente' })
  async createForm(@Body() createFormDto: CreateFormDto) {
    return this.evaluationsQuestionsService.createForm(createFormDto);
  }
}

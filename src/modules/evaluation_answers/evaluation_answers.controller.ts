import { Controller, Post, Body, Param, HttpCode, HttpStatus, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EvaluationAnswersService } from './evaluation_answers.service';
import { SubmitExamDto } from './dto/submit-exam.dto';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';

@ApiTags('evaluation-answers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationAnswersController {
  constructor(private readonly evaluationAnswersService: EvaluationAnswersService) {}

  @Post(':evaluationId/submit-exam')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar respuestas de examen y calificar automáticamente' })
  @ApiParam({ name: 'evaluationId', type: String })
  @ApiBody({ type: SubmitExamDto })
  async submitExamAnswers(
    @Param('evaluationId', ParseUUIDPipe) evaluationId: string,
    @Req() req: RequestWithUser,
    @Body() submitExamDto: SubmitExamDto,
  ) {
    return this.evaluationAnswersService.submitExamAnswers(evaluationId, req.user.userId, submitExamDto);
  }
}

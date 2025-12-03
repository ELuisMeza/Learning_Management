import { Controller } from '@nestjs/common';
import { EvaluationAnswersService } from './evaluation_answers.service';

@Controller('evaluation-answers')
export class EvaluationAnswersController {
  constructor(private readonly evaluationAnswersService: EvaluationAnswersService) {}
}

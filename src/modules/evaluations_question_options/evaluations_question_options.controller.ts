import { Controller } from '@nestjs/common';
import { EvaluationsQuestionOptionsService } from './evaluations_question_options.service';

@Controller('evaluations-question-options')
export class EvaluationsQuestionOptionsController {
  constructor(private readonly evaluationsQuestionOptionsService: EvaluationsQuestionOptionsService) {}
}

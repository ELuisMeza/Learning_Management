import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEvaluationResultDto } from './create-evaluation-result.dto';

export class UpdateEvaluationResultDto extends OmitType(
  PartialType(CreateEvaluationResultDto),
  ['evaluationId', 'studentId'] as const,
) {}

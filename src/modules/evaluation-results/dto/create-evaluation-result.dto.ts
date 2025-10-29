import { IsUUID, IsOptional, IsDecimal, IsString, IsDateString } from 'class-validator';

export class CreateEvaluationResultDto {
  @IsUUID()
  evaluationId: string;

  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsDecimal()
  score?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsDateString()
  evaluatedAt?: string;
}

import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsDecimal,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateEvaluationDto {
  @IsUUID()
  classId: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['teacher', 'self', 'peer'])
  evaluationMode?: string;

  @IsUUID()
  evaluationTypeId: string;

  @IsOptional()
  @IsUUID()
  rubricId?: string;

  @IsOptional()
  @IsDecimal()
  maxScore?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  status?: string;
}

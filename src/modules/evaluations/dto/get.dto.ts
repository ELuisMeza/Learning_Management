import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { BasePayloadGetDto } from "src/globals/dto/base-payload-get.dto";
import { EvaluationModes } from "src/globals/enums/evaluation-modes.enum";

export class GetEvaluationsDto extends BasePayloadGetDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la clase' })
  @IsOptional()
  @IsUUID()
  classId?: string;

  @ApiProperty({ example: EvaluationModes.TEACHER, description: 'Modo de evaluación' })
  @IsOptional()
  @IsEnum(EvaluationModes)
  evaluationMode?: EvaluationModes;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del tipo de evaluación' })
  @IsOptional()
  @IsUUID()
  evaluationTypeId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la rúbrica' })
  @IsOptional()
  @IsUUID()
  rubricId?: string;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha de creación de la evaluación' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha de fin de la evaluación' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
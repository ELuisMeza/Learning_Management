import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { EvaluationModes } from "src/globals/enums/evaluation-modes.enum";

export class CreateEvaluationDto {

  @ApiProperty({ example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c', description: 'ID de la clase' })
  @IsNotEmpty()
  @IsUUID()
  classId: string;

  @ApiProperty({ example: 'Evaluación 1', description: 'Nombre de la evaluación' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descripción de la evaluación', description: 'Descripción de la evaluación' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: EvaluationModes.TEACHER, description: 'Modo de evaluación' })
  @IsNotEmpty()
  @IsEnum(EvaluationModes)
  evaluationMode: EvaluationModes;

  @ApiProperty({ example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c', description: 'ID del tipo de evaluación' })
  @IsNotEmpty()
  @IsUUID()
  evaluationTypeId: string; 

  @ApiProperty({ example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c', description: 'ID de la rúbrica' })
  @IsNotEmpty()
  @IsUUID()
  rubricId: string;

  @ApiProperty({ example: 100, description: 'Puntaje máximo de la evaluación' })
  @IsNotEmpty()
  @IsNumber()
  maxScore: number;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha de inicio de la evaluación' })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2025-01-01', description: 'Fecha de fin de la evaluación' })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
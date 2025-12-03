import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionOptionDto } from 'src/modules/evaluations_question_options/dto/create-dto';

export class QuestionDto {
  @ApiProperty({
    example: '¿Cuál es la capital de Perú?',
    description: 'Etiqueta de la pregunta',
  })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    example: 10,
    description: 'Puntaje de la pregunta',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({
    type: [CreateQuestionOptionDto],
    description: 'Array de opciones para la pregunta',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options: CreateQuestionOptionDto[];
}

export class CreateFormDto {
  @ApiProperty({
    example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c',
    description: 'ID de la evaluación',
  })
  @IsNotEmpty()
  @IsUUID()
  evaluation_id: string;

  @ApiProperty({
    type: [QuestionDto],
    description: 'Array de preguntas con sus opciones',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}


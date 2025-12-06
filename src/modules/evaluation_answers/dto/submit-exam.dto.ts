import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ description: 'ID de la pregunta' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ description: 'ID de la opción seleccionada' })
  @IsUUID()
  @IsNotEmpty()
  optionId: string;
}

export class SubmitExamDto {
  @ApiProperty({ description: 'Array de respuestas del estudiante', type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}


import { IsArray, IsNotEmpty, IsUUID, IsOptional, ValidateNested, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RubricScoreDto {
  @ApiProperty({ description: 'ID del criterio' })
  @IsUUID()
  @IsNotEmpty()
  criteriaId: string;

  @ApiProperty({ description: 'ID del nivel seleccionado' })
  @IsUUID()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ description: 'Puntaje obtenido' })
  @IsNumber()
  @IsNotEmpty()
  score: number;
}

export class SubmitRubricDto {
  @ApiProperty({ description: 'ID del estudiante evaluado (para coevaluación)', required: false })
  @IsUUID()
  @IsOptional()
  evaluatedId?: string;

  @ApiProperty({ description: 'Array de puntajes por criterio', type: [RubricScoreDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RubricScoreDto)
  scores: RubricScoreDto[];

  @ApiProperty({ description: 'Comentarios adicionales', required: false })
  @IsString()
  @IsOptional()
  comments?: string;
}


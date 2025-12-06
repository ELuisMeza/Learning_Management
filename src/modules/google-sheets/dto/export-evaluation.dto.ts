import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExportEvaluationDto {
  @ApiProperty({ description: 'ID de la evaluación a exportar' })
  @IsString()
  evaluationId: string;

  @ApiProperty({ description: 'ID de la hoja de cálculo existente (opcional)', required: false })
  @IsOptional()
  @IsString()
  spreadsheetId?: string;

  @ApiProperty({ description: 'Nombre de la hoja (por defecto: Resultados)', required: false })
  @IsOptional()
  @IsString()
  sheetName?: string;

  @ApiProperty({ description: 'Crear nueva hoja si no existe spreadsheetId', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  createNew?: boolean;
}


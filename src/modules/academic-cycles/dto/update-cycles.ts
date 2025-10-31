import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsEnum, IsOptional } from "class-validator";

export class UpdateAcademicCycleDto {

  @ApiProperty({ example: 'Ciclo de Ingeniería', description: 'Nombre del ciclo académico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Descripción del ciclo académico', description: 'Descripción del ciclo académico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 1, description: 'Orden del ciclo académico', minimum: 1 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  orderNumber: number;

  @ApiProperty({ example: 120, description: 'Créditos requeridos del ciclo académico', minimum: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  creditsRequired: number;

  @ApiProperty({ example: 16, description: 'Duración en semanas del ciclo académico', minimum: 1 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  durationWeeks: number;

  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del ciclo académico' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status: GlobalStatus;
}
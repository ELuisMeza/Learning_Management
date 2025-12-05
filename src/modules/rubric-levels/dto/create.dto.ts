import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateRubricLevelDto {
  @ApiProperty({ example: 'Excelente', description: 'Nombre del nivel de logro' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'El estudiante demuestra dominio completo', description: 'Descripción del nivel' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 10.0, description: 'Puntuación del nivel' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score: number;
}
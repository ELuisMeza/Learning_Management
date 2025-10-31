import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";

export class UpdateCareerDto {

  @ApiProperty({ example: 'Ingeniería de Software', description: 'Nombre de la carrera' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Descripción de la carrera', description: 'Descripción de la carrera' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 'Ingeniería de Software', description: 'Título de la carrera' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  degreeTitle: string;

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Modalidad de la carrera' })
  @IsNotEmpty()
  @IsEnum(TeachingModes)
  modality: TeachingModes;

  @ApiProperty({ example: 4, description: 'Duración de la carrera en años' })
  @IsInt()
  @IsNotEmpty()
  durationYears: number;

  @ApiProperty({ example: 120, description: 'Créditos totales de la carrera' })
  @IsInt()
  @IsNotEmpty()
  totalCredits: number;
}
import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, IsJSON, IsObject, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";

export class UpdateClassDto {
  @ApiProperty({ example: 'Clase de Ingeniería', description: 'Nombre de la clase' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Descripción de la clase', description: 'Descripción de la clase', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 120, description: 'Créditos de la clase', required: false })
  @IsInt()
  @IsOptional()
  credits?: number;

  @ApiProperty({ example: 10, description: 'Máximo de estudiantes de la clase', required: false })
  @IsInt()
  @IsOptional()
  maxStudents?: number;  

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Tipo de enseñanza de la clase', required: false })
  @IsEnum(TeachingModes)
  @IsOptional()
  typeTeaching?: TeachingModes;

  @ApiProperty({ example: 'ID del profesor de la clase', description: 'Profesor de la clase', required: false })
  @IsUUID()
  @IsOptional()
  teacherId?: string;
} 
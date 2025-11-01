import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, IsJSON, IsObject, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";

export class UpdateClassDto {
  @ApiProperty({ example: 'Clase de Ingeniería', description: 'Nombre de la clase' })
  @IsString()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descripción de la clase', description: 'Descripción de la clase' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 120, description: 'Créditos de la clase' })
  @IsInt()
  @IsNotEmpty()
  credits: number;

  @ApiProperty({ example: 10, description: 'Máximo de estudiantes de la clase' })
  @IsInt()
  @IsNotEmpty()
  maxStudents: number;  

  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado de la clase' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status: GlobalStatus;

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Tipo de enseñanza de la clase' })
  @IsEnum(TeachingModes)
  @IsNotEmpty()
  typeTeaching: TeachingModes;

  @ApiProperty({ example: 'ID del profesor de la clase', description: 'Profesor de la clase' })
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;
} 
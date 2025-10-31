import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { GlobalStatus } from "src/globals/enums/global-status.enum";

export class UpdateAcademicModuleDto {
  @ApiProperty({ example: 'Módulo de Ingeniería', description: 'Nombre del módulo académico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Descripción del módulo académico', description: 'Descripción del módulo académico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({ example: 1, description: 'Orden del módulo académico', minimum: 1 })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  orderNumber: number;  

  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del módulo académico' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status: GlobalStatus;
}
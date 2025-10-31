import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, Min, IsInt, IsUUID } from "class-validator";
import { UpdateAcademicModuleDto } from "./update-module.dto";

export class CreateAcademicModuleDto extends UpdateAcademicModuleDto {
  @ApiProperty({ example: 'ING-001', description: 'Código del módulo académico' })
  @IsString()
  @IsNotEmpty() 
  @MaxLength(20)
  code: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del ciclo académico' })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;
}
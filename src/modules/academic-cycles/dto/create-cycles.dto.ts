import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { UpdateAcademicCycleDto } from "./update-cycles";

export class CreateAcademicCycleDto extends UpdateAcademicCycleDto {

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la carrera' })
  @IsUUID()
  @IsNotEmpty()
  careerId: string;

  @ApiProperty({ example: 'ING-001', description: 'Código del ciclo académico' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;
}
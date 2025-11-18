import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";
import { UpdateClassDto } from "./update-class.dto";
import { MaxLength } from "class-validator";

export class CreateClassDto extends UpdateClassDto {
  @ApiProperty({ example: 'ING-001', description: 'Código de la clase (opcional, se genera automáticamente si no se proporciona)', required: false })
  @IsString()
  @MaxLength(10)
  code?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del módulo académico', required: false })
  @IsUUID()
  @IsOptional()
  moduleId?: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsUUID } from "class-validator";
import { UpdateClassDto } from "./update-class.dto";
import { MaxLength } from "class-validator";

export class CreateClassDto extends UpdateClassDto {
  @ApiProperty({ example: 'ING-001', description: 'Código de la clase' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del módulo académico' })
  @IsUUID()
  @IsNotEmpty()
  moduleId: string;
}
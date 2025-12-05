import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min } from "class-validator";
import { CreateRubricLevelDto } from "src/modules/rubric-levels/dto/create.dto";
import { Type } from "class-transformer";


export class CreateRubricCriterionDto {
  @ApiProperty({ example: 'Criterio 1', description: 'Nombre del criterio' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Descripción del criterio', description: 'Descripción del criterio' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 1.0, description: 'Peso del criterio' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ 
      type: [CreateRubricLevelDto], 
      description: 'Niveles de logro del criterio',
      example: [
          { name: 'Excelente', description: 'Dominio completo', score: 10.0 },
          { name: 'Bueno', description: 'Buen desempeño', score: 7.5 },
          { name: 'Regular', description: 'Desempeño regular', score: 5.0 }
      ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRubricLevelDto)
  levels: CreateRubricLevelDto[];
}
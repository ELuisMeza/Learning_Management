import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateRubricCriterionDto } from "src/modules/rubric-criteria/dto/create.dto";

export class CreateRubricDto {
    @ApiProperty({ example: 'Rubrica 1', description: 'Nombre de la rubrica' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Descripción de la rubrica', description: 'Descripción de la rubrica' })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ 
        type: [CreateRubricCriterionDto], 
        description: 'Criterios de la rúbrica con sus niveles',
        example: [
            {
                name: 'Criterio 1',
                description: 'Descripción del criterio',
                weight: 1.0,
                orderNumber: 1,
                levels: [
                    { name: 'Excelente', description: 'Dominio completo', score: 10.0 },
                    { name: 'Bueno', description: 'Buen desempeño', score: 7.5 }
                ]
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRubricCriterionDto)
    criteria: CreateRubricCriterionDto[];
}
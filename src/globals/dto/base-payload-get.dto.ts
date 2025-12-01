import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class BasePayloadGetDto {
  @ApiProperty({ 
    example: 1, 
    description: 'Número de página', 
    required: false,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    example: 10, 
    description: 'Cantidad de elementos por página', 
    required: false,
    default: 10,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ 
    example: 'Ciclo', 
    description: 'Término de búsqueda', 
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}


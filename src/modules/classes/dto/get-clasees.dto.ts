import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { BasePayloadGetDto } from "src/globals/dto/base-payload-get.dto";
import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";

export class GetClassesDto extends BasePayloadGetDto {
  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado de la clase' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status?: GlobalStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del módulo académico' })
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del profesor' })
  @IsUUID()
  @IsOptional()
  teacherId?: string;
  
  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Modalidad de la clase' })
  @IsEnum(TeachingModes)
  @IsOptional()
  typeTeaching?: TeachingModes;
}

export class GetClassesByTeacherIdDto extends BasePayloadGetDto {

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del módulo académico' })
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del ciclo académico' })
  @IsUUID()
  @IsOptional()
  cycleId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la carrera' })
  @IsUUID()
  @IsOptional()
  careerId?: string;

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Modalidad de la clase' })
  @IsEnum(TeachingModes)
  @IsOptional()
  typeTeaching?: TeachingModes;
}
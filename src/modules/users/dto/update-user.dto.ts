import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";
import { GenderType } from "src/globals/enums/gender-type.enum";

export class UpdateUserDto {
  @ApiProperty({
    example: 'Juan',
    maxLength: 100,
    description: 'Nombre del usuario',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Pérez',
    maxLength: 100,
    description: 'Apellido paterno del usuario',
  })
  @IsString()
  @MaxLength(100)
  lastNameFather: string;

  @ApiProperty({
    example: 'García',
    maxLength: 100,
    required: false,
    description: 'Apellido materno del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastNameMother?: string;

  @ApiProperty({
    enum: GenderType,
    example: GenderType.MALE,
    description: 'Género del usuario',
  })
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({
    example: '1990-05-20',
    description: 'Fecha de nacimiento del usuario en formato ISO (YYYY-MM-DD)',
  })
  @IsDateString()
  birthdate: string;

  @ApiProperty({
    example: '+51 987654321',
    maxLength: 20,
    required: false,
    description: 'Número de teléfono del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
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

  @ApiProperty({
    example: 'Odontología general',
    maxLength: 100,
    required: false,
    description: 'Especialidad del profesor o profesional (solo aplicable si el usuario es docente)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @ApiProperty({
    example: 'Magíster en Educación',
    maxLength: 100,
    required: false,
    description: 'Grado académico del usuario (solo aplicable si es docente)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  academicDegree?: string;

  @ApiProperty({
    example: 5,
    required: false,
    description: 'Años de experiencia profesional (solo aplicable si es docente)',
  })
  @IsOptional()
  @IsInt()
  experienceYears?: number;

  @ApiProperty({
    example: 'Docente apasionado por la enseñanza de nuevas tecnologías.',
    required: false,
    description: 'Breve biografía o descripción del perfil del usuario',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/cv/juan-perez.pdf',
    maxLength: 255,
    required: false,
    description: 'URL del currículum vitae del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cvUrl?: string;

  @ApiProperty({
    enum: TeachingModes,
    example: TeachingModes.IN_PERSON,
    required: false,
    description: 'Modalidad de enseñanza (presencial, virtual o híbrida). Aplica solo a docentes.',
  })
  @IsOptional()
  @IsEnum(TeachingModes)
  teachingModes?: TeachingModes;
}
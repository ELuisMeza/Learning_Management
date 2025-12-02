import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum, MaxLength, IsNotEmpty } from 'class-validator';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';

export class CreateUpdateTeacherDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Dr. Juan Pérez González', description: 'Apellativo del profesor' })
  @IsString()
  @MaxLength(150)
  appellative: string;

  @IsOptional()
  @ApiProperty({ example: 'Ingeniería de Software', description: 'Especialidad del profesor' })
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @ApiProperty({ example: 'Magíster en Ingeniería de Software', description: 'Grado académico del profesor' })
  @IsString()
  @MaxLength(100)
  academicDegree?: string;

  @IsOptional()
  @ApiProperty({ example: 5, description: 'Años de experiencia del profesor' })
  @IsInt()
  experienceYears?: number;

  @IsOptional()
  @ApiProperty({ example: 'Docente apasionado por la enseñanza de nuevas tecnologías.', description: 'Biografía del profesor' })
  @IsString()
  bio?: string;

  @IsOptional()
  @ApiProperty({ example: 'https://example.com/cv/juan-perez.pdf', description: 'URL del currículum vitae del profesor' })
  @IsString()
  @MaxLength(255)
  cvUrl?: string;

  @IsNotEmpty()
  @ApiProperty({ example: TeachingModes.IN_PERSON, description: 'Modalidad de enseñanza del profesor' })
  @IsEnum(TeachingModes)
  teachingModes: TeachingModes;
  
}

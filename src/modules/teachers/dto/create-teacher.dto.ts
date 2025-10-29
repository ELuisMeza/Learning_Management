import { IsString, IsOptional, IsInt, IsEnum, MaxLength } from 'class-validator';

export class CreateTeacherDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  academicDegree?: string;

  @IsOptional()
  @IsInt()
  experienceYears?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  cvUrl?: string;

  @IsOptional()
  @IsEnum(['presencial', 'virtual', 'semipresencial'])
  teachingModes?: string;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  status?: string;
}

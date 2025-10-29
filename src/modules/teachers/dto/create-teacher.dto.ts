import { IsString, IsOptional, IsInt, IsEnum, MaxLength, IsNotEmpty } from 'class-validator';
import { TeachingModes } from 'src/globals/enums/teaching-modes.enum';

export class CreateUpdateTeacherDto {
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

  @IsNotEmpty()
  @IsEnum(TeachingModes)
  teachingModes: TeachingModes;
}

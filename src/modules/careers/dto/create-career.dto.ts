import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  degreeTitle?: string;

  @IsEnum(['presencial', 'virtual', 'semipresencial'])
  modality: string;

  @IsInt()
  @Min(1)
  durationYears: number;

  @IsInt()
  @Min(0)
  totalCredits: number;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  status?: string;
}

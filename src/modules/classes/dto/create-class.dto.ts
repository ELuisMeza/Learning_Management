import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsUUID,
  IsObject,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateClassDto {
  @IsUUID()
  moduleId: string;

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
  @IsInt()
  @Min(0)
  credits?: number;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  status?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxStudents?: number;
}

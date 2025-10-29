import { IsString, IsOptional, IsInt, IsEnum, IsUUID, MaxLength } from 'class-validator';

export class CreateAcademicCycleDto {
  @IsUUID()
  careerId: string;

  @IsString()
  @MaxLength(20)
  code: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  orderNumber?: number;

  @IsOptional()
  @IsInt()
  creditsRequired?: number;

  @IsOptional()
  @IsInt()
  durationWeeks?: number;

  @IsOptional()
  @IsEnum(['activo', 'inactivo'])
  status?: string;
}

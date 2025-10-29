import { IsString, IsOptional, IsInt, IsEnum, IsUUID, MaxLength } from 'class-validator';

export class CreateAcademicModuleDto {
  @IsUUID()
  cycleId: string;

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
  @IsEnum(['activo', 'inactivo'])
  status?: string;
}

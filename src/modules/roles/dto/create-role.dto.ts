import { IsString, IsEnum, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsEnum(['activo', 'inactivo'])
  status: string;
}

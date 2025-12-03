import {
  IsString,
  IsEmail,
  IsUUID,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class CreateUserDto extends UpdateUserDto {

  @ApiProperty({
    example: 'DNI',
    description: 'Tipo de documento de identidad del usuario',
    maxLength: 20,
    required: false,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  documentType?: string;

  @ApiProperty({
    example: '12345678',
    description: 'Número de documento de identidad del usuario',
    maxLength: 20,
    required: false,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  documentNumber?: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del usuario',
    maxLength: 150,
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'SuperSegura123',
    description: 'Contraseña del usuario',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiProperty({
    example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c',
    description: 'ID del rol asignado al usuario',
  })
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiProperty({
    example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c',
    description: 'ID del profesor asignado al usuario',
  })
  @IsUUID()
  @IsOptional()
  teacherId?: string;
}

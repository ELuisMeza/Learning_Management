import {
  IsString,
  IsEmail,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class CreateUserDto extends UpdateUserDto {

  @ApiProperty({ example: 'DNI', maxLength: 20, required: false })
  @IsString()
  @MaxLength(20)
  documentType: string;

  @ApiProperty({ example: '12345678', maxLength: 20, required: false })
  @IsString()
  @MaxLength(20)
  documentNumber: string;

  @ApiProperty({ example: 'juan.perez@example.com', maxLength: 150 })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'SuperSegura123', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiProperty({ example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c' })
  @IsUUID()
  roleId: string;
}

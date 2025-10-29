import {
  IsString,
  IsEmail,
  IsUUID,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderType } from 'src/globals/enums/gender-type.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Pérez', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  lastNameFather: string;

  @ApiProperty({ example: 'García', maxLength: 100, required: false })
  @IsString()
  @MaxLength(100)
  lastNameMother: string;

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

  @ApiProperty({ enum: GenderType, example: GenderType.MALE })
  @IsEnum(GenderType)
  gender: GenderType;

  @ApiProperty({ example: '1990-05-20' })
  @IsDateString()
  birthdate: string;

  @ApiProperty({ example: '+51 987654321', maxLength: 20, required: false })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c' })
  @IsUUID()
  roleId: string;
}

import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { User } from "../users.entity";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";
import { GenderType } from "src/globals/enums/gender-type.enum";

export class UpdateUserDto {
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

  @ApiProperty({ example: 'Especialidad del profesor', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @ApiProperty({ example: 'Grado académico del profesor', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  academicDegree?: string;

  @ApiProperty({ example: 'Años de experiencia del profesor', required: false })
  @IsOptional()
  @IsInt()
  experienceYears?: number;

  @ApiProperty({ example: 'Biografía del profesor', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'URL del CV del profesor', maxLength: 255, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cvUrl?: string;

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON })
  @IsOptional()
  @IsEnum(TeachingModes)
  teachingModes: TeachingModes;
}
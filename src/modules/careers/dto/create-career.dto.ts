import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { UpdateCareerDto } from './update-career.dto';

export class CreateCareerDto extends UpdateCareerDto {
  
  @ApiProperty({ example: 'ING-001', description: 'Código de la carrera' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string; 
}
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignTextDto {
  @ApiProperty({
    description: 'Texto plano a firmar',
    example: 'Hola mundo',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}


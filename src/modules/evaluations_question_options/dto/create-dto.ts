import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class CreateQuestionOptionDto {
  @ApiProperty({
    example: 'Opción A',
    description: 'Etiqueta de la opción',
  })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty({
    example: false,
    description: 'Indica si la opción es correcta',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_correct: boolean;
}

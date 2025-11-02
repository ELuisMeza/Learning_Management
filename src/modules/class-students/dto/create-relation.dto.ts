import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRelationDto {
  @ApiProperty({ example: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c', description: 'ID de la clase' })
  @IsUUID()
  @IsNotEmpty()
  classId: string;
}
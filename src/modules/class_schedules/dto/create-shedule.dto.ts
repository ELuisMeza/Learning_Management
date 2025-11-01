import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UpdateScheduleDto } from "./update-schedule.dto";

export class CreateScheduleDto extends UpdateScheduleDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la clase' })
  @IsUUID()
  @IsNotEmpty()
  classId: string;
}
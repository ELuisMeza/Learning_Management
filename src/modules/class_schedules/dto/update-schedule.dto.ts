import { DayOfWeek } from "src/globals/enums/day-of-week.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";

export class UpdateScheduleDto {
  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.MONDAY, description: 'Día de la semana' })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '10:00', description: 'Hora de inicio' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '12:00', description: 'Hora de fin' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ example: 'Aula 101', description: 'Aula' })
  @IsString()
  @IsNotEmpty()
  room: string;

  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del horario' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status: GlobalStatus;

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Modalidad de enseñanza' })
  @IsEnum(TeachingModes)
  @IsNotEmpty()
  typeTeaching: TeachingModes;
}
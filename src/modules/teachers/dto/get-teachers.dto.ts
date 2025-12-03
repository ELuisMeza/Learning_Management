import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { BasePayloadGetDto } from "src/globals/dto/base-payload-get.dto";
import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";

export class GetTeachersDto extends BasePayloadGetDto {
  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del profesor' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status?: GlobalStatus;

  @ApiProperty({ enum: TeachingModes, example: TeachingModes.HYBRID, description: 'Modalidad de enseñanza del profesor' })
  @IsEnum(TeachingModes)
  @IsOptional()
  teachingMode?: TeachingModes;
}   
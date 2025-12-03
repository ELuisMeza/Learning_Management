import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { BasePayloadGetDto } from "src/globals/dto/base-payload-get.dto";
import { TeachingModes } from "src/globals/enums/teaching-modes.enum";
import { GlobalStatus } from "src/globals/enums/global-status.enum";

export class GetCareerDto extends BasePayloadGetDto {
  @ApiProperty({ enum: TeachingModes, example: TeachingModes.IN_PERSON, description: 'Modalidad de la carrera' })
  @IsNotEmpty()
  @IsEnum(TeachingModes)
  @IsOptional()
  modality?: TeachingModes;

  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado de la carrera' })
  @IsNotEmpty()
  @IsEnum(GlobalStatus)
  @IsOptional()
  status?: GlobalStatus;
}
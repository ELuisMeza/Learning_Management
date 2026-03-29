import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { BasePayloadGetDto } from "../../../globals/dto/base-payload-get.dto";
import { GlobalStatus } from "../../../globals/enums/global-status.enum";

export class GetCyclesDto extends BasePayloadGetDto {

  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del ciclo académico' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status?: GlobalStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID de la carrera' })
  @IsOptional()
  @IsUUID()
  careerId?: string;
}
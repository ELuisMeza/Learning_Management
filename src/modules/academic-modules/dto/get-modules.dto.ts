import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { BasePayloadGetDto } from "src/globals/dto/base-payload-get.dto";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetModulesDto extends BasePayloadGetDto {
  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del módulo académico' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status?: GlobalStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del ciclo académico' })
  @IsUUID()
  @IsOptional()
  cycleId?: string;
}
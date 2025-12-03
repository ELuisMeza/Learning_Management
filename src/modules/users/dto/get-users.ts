import { GlobalStatus } from "src/globals/enums/global-status.enum";
import { IsEnum, IsOptional } from "class-validator";
import { BasePayloadGetDto } from "src/globals/dto/base-payload-get.dto";
import { ApiProperty } from "@nestjs/swagger";

export class GetUsersDto extends BasePayloadGetDto {
  @ApiProperty({ enum: GlobalStatus, example: GlobalStatus.ACTIVE, description: 'Estado del usuario' })
  @IsEnum(GlobalStatus)
  @IsOptional()
  status?: GlobalStatus;
}
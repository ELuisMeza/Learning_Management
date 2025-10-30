import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RubricLevelsService } from './rubric-levels.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rubric-levels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rubric-levels')
export class RubricLevelsController {
  constructor(private readonly rubricLevelsService: RubricLevelsService) {}

}

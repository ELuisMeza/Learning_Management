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
import { RubricCriteriaService } from './rubric-criteria.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('rubric-criteria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rubric-criteria')
export class RubricCriteriaController {
  constructor(private readonly rubricCriteriaService: RubricCriteriaService) {}
}

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
import { AcademicModulesService } from './academic-modules.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('academic-modules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('academic-modules')
export class AcademicModulesController {
  constructor(private readonly academicModulesService: AcademicModulesService) {}
}

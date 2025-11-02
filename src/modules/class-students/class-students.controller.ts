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
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ClassStudentsService } from './class-students.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRelationDto } from './dto/create-relation.dto';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';

@ApiTags('class-students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('class-students')
export class ClassStudentsController {
  constructor(private readonly classStudentsService: ClassStudentsService) {}

  @Post('by-student')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Matricular estudiante en clase' })
  @ApiCreatedResponse({ description: 'Estudiante matriculado en clase' })
  @ApiBody({ type: CreateRelationDto })
  matriculateStudent(@Body() createRelationDto: CreateRelationDto, @Req() req: RequestWithUser) {
    return this.classStudentsService.matriculateStudent(createRelationDto, req.user.userId);
  }
}

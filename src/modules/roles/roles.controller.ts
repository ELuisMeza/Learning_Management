import {
  Controller,
  Get,
  HttpCode,
  HttpStatus, 
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar roles' })
  @ApiOkResponse({ description: 'Listado de roles' })
  getAll() {
    return this.rolesService.getAll();
  }
}

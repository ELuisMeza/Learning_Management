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
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailsService } from '../emails/emails.service';
import { CreateUpdateTeacherDto } from '../teachers/dto/create-teacher.dto';
import { BasePayloadGetDto } from 'src/globals/dto/base-payload-get.dto';
import { GetUsersDto } from './dto/get-users';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService
  ) {}

  @Post('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiBody({ type: GetUsersDto })
  @ApiOkResponse({ description: 'Listado de usuarios' })
  async getAll(@Body() getAllDto: GetUsersDto) {
    return this.usersService.getAll(getAllDto);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener usuario autenticado' })
  @ApiOkResponse({ description: 'Usuario autenticado' })
  async googleAuthCallback(@Req() req: RequestWithUser) {
    return this.usersService.getByIdAndActive(req.user.userId);
  }

  @Post('create-teacher')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario profesor' })
  @ApiCreatedResponse({ description: 'Usuario profesor creado' })
  async createTeacher(@Body() createTeacherDto: CreateUpdateTeacherDto, @Req() req: RequestWithUser) {
    return this.usersService.createTeacher(createTeacherDto, req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiCreatedResponse({ description: 'Usuario creado' })
  async create(@Body() createUserDto: CreateUserDto, @Req() req: RequestWithUser) {
    const user = await this.usersService.create(createUserDto, req.user.userId);
    await this.emailsService.sendWelcomeEmail(user.email, user.name);
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiOkResponse({ description: 'Usuario actualizado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  } 
}

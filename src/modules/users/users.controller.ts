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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Payload para crear usuario',
    examples: {
      ejemplo: {
        summary: 'Ejemplo básico',
        value: {
          name: 'Juan',
          lastNameFather: 'Pérez',
          lastNameMother: 'García',
          documentType: 'DNI',
          documentNumber: '12345678',
          email: 'juan.perez@example.com',
          password: 'SuperSegura123',
          gender: 'male',
          birthdate: '1990-05-20',
          phone: '+51 987654321',
          roleId: 'f5f8b4f0-3f07-4c0f-8a0a-4b4a5b7a9a1c',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Usuario creado' })
  create(@Body() createUserDto: CreateUserDto, @Req() req: RequestWithUser) {
    return this.usersService.create(createUserDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiOkResponse({ description: 'Listado de usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por id' })
  @ApiOkResponse({ description: 'Usuario encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiOkResponse({ description: 'Usuario actualizado' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiNoContentResponse({ description: 'Usuario eliminado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

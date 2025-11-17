import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';              
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:5173';

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticación de usuario' })
  @ApiBody({
    type: LoginDto,
    description: 'Payload para login',
    examples: {
      ejemplo: {
        summary: 'Ejemplo básico',
        value: {
          email: 'juan.perez@example.com',
          password: 'SuperSegura123',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Retorna JWT como Bearer token' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Iniciar autenticación con Google' })
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Req() req: Request) {
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiOkResponse({ description: 'Redirige al dashboard con el token JWT' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.googleLogin(req.user);
      const redirectUrl = `${this.frontendUrl}/auth/callback?token=${access_token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      const errorUrl = `${this.frontendUrl}/login`;
      res.redirect(errorUrl);
    }
  }
}

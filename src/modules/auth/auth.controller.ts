import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
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

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiOkResponse({ description: 'Retorna JWT como Bearer token después de autenticar con Google' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req.user);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
      const token = encodeURIComponent(result.access_token);
      const userData = encodeURIComponent(JSON.stringify(result.user));
      
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${userData}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
}



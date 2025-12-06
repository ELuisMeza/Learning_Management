import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import { ExportEvaluationDto } from './dto/export-evaluation.dto';
import { BadRequestException } from '@nestjs/common';

@ApiTags('google-sheets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('google-sheets')
export class GoogleSheetsController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Get('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener URL de autenticación OAuth2 con Google' })
  @ApiOkResponse({ description: 'URL de autenticación generada' })
  async getAuthUrl() {
    const authUrl = this.googleSheetsService.getAuthUrl();
    return {
      authUrl,
      message: 'Redirige al usuario a esta URL para autenticar con Google',
    };
  }

  @Get('auth/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Callback de OAuth2 - Intercambiar código por tokens' })
  @ApiOkResponse({ description: 'Tokens obtenidos exitosamente' })
  @ApiQuery({ name: 'code', description: 'Código de autorización de Google' })
  async handleCallback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Código de autorización requerido');
    }

    const tokens = await this.googleSheetsService.getTokensFromCode(code);
    
    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: 'Autenticación exitosa. Guarda estos tokens para futuras exportaciones.',
    };
  }

  @Get('auth/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar estado de autenticación' })
  @ApiOkResponse({ description: 'Estado de autenticación' })
  @ApiQuery({ name: 'accessToken', required: false, description: 'Token de acceso (opcional)' })
  async checkAuthStatus(@Query('accessToken') accessToken?: string) {
    const status = await this.googleSheetsService.checkAuthStatus(accessToken);
    return status;
  }

  @Post('export-evaluation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exportar resultados de evaluación a Google Sheets' })
  @ApiOkResponse({ description: 'Resultados exportados exitosamente' })
  async exportEvaluation(
    @Req() req: RequestWithUser,
    @Body() exportDto: ExportEvaluationDto,
    @Query('accessToken') accessToken?: string,
    @Query('refreshToken') refreshToken?: string,
  ) {
    // En producción, los tokens deberían almacenarse en la base de datos asociados al usuario
    // Por ahora, los recibimos como query params o del body
    const token = accessToken || (exportDto as any).accessToken;
    const refresh = refreshToken || (exportDto as any).refreshToken;

    if (!token) {
      throw new BadRequestException(
        'Token de acceso requerido. Por favor, autentícate primero con Google.',
      );
    }

    const result = await this.googleSheetsService.exportEvaluationResults(
      exportDto,
      token,
      refresh,
    );

    return {
      success: true,
      ...result,
      message: 'Resultados exportados a Google Sheets exitosamente',
    };
  }
}


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
  Res,
  Query,
  Header,
} from '@nestjs/common';
import { ClassStudentsService } from './class-students.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRelationDto } from './dto/create-relation.dto';
import type { RequestWithUser } from 'src/globals/types/request-with-user.type';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('class-students')
@Controller('class-students')
export class ClassStudentsController {

  private readonly frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:3000';

  constructor(
    private readonly classStudentsService: ClassStudentsService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('by-student')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Matricular estudiante en clase' })
  @ApiCreatedResponse({ description: 'Estudiante matriculado en clase' })
  @ApiBody({ type: CreateRelationDto })
  matriculateStudent(@Body() createRelationDto: CreateRelationDto, @Req() req: RequestWithUser) {
    return this.classStudentsService.matriculateStudent(createRelationDto, req.user.userId);
  }

  @Post('by-qr')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Matricular estudiante en clase usando código QR' })
  @ApiCreatedResponse({ description: 'Estudiante matriculado en clase usando QR' })
  @ApiBody({ type: CreateRelationDto })
  async matriculateStudentByQR(@Body() createRelationDto: CreateRelationDto, @Req() req: RequestWithUser) {
    return this.classStudentsService.matriculateStudentByQR(createRelationDto.classId, req.user.userId);
  }

  @Get('by-student')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener clases del estudiante autenticado' })
  @ApiOkResponse({ description: 'Listado de clases del estudiante' })
  async getMyClasses(@Req() req: RequestWithUser) {
    return await this.classStudentsService.getClassesByStudentId(req.user.userId);
  }

  @Get('enroll/:classId')
  @ApiOperation({ summary: 'Matricular estudiante automáticamente desde QR (público)' })
  @ApiParam({ name: 'classId', description: 'ID de la clase' })
  @ApiQuery({ name: 'token', required: false, description: 'Token JWT del estudiante' })
  async enrollFromQR(
    @Param('classId') classId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).send(`
        <html>
          <head>
            <title>Error - Sin autenticación</title>
            <meta http-equiv="refresh" content="5;url=${this.frontendUrl}/login">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: #f5f5f5;
              }
              .error { 
                color: #d32f2f; 
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                max-width: 500px; 
                margin: 0 auto;
              }
              .login-link {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background: #1976d2;
                color: white;
                text-decoration: none;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="error">
              <h1> Error de Autenticación</h1>
              <p>Por favor, inicia sesión en la aplicación y vuelve a escanear el código QR.</p>
              <a href="${this.frontendUrl}/login" class="login-link">Ir al Login</a>
              <p><small>Serás redirigido en 5 segundos...</small></p>
            </div>
          </body>
        </html>
      `);
    }

    try {
      // Validar y decodificar el token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Intentar matricular al estudiante
      await this.classStudentsService.matriculateStudentByQR(classId, userId);

      // Responder con HTML de éxito
      return res.send(`
        <html>
          <head>
            <title>¡Matriculación Exitosa!</title>
            <meta http-equiv="refresh" content="3;url=${this.frontendUrl}">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .success { 
                background: white; 
                color: #2e7d32; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                max-width: 500px;
                margin: 0 auto;
              }
              h1 { margin: 0; }
              .checkmark { font-size: 60px; }
            </style>
          </head>
          <body>
            <div class="success">
              <div class="checkmark">✅</div>
              <h1>¡Matriculación Exitosa!</h1>
              <p>Te has matriculado correctamente en la clase.</p>
              <p><small>Serás redirigido en 3 segundos...</small></p>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      // Error en la matrícula
      const errorMessage = error.message || 'Error desconocido';
      const isAlreadyEnrolled = errorMessage.includes('ya está matriculado');
      const isClassFull = errorMessage.includes('máximo');
      const isNotStudent = errorMessage.includes('no es un estudiante');
      const isTokenInvalid = errorMessage.includes('expired') || errorMessage.includes('invalid');

      let html = '';
      if (isTokenInvalid) {
        html = `
          <html>
            <head>
              <title>Error - Token Inválido</title>
              <meta http-equiv="refresh" content="5;url=${this.frontendUrl}/login">
              <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .error { color: #d32f2f; background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; }
              </style>
            </head>
            <body style="background: #f5f5f5;">
              <div class="error">
                <h1> Sesión Expirada</h1>
                <p>Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
                <p><small>Serás redirigido en 5 segundos...</small></p>
              </div>
            </body>
          </html>
        `;
      } else if (isAlreadyEnrolled) {
        html = `
          <html>
            <head>
              <title>Ya Matriculado</title>
              <meta http-equiv="refresh" content="3;url=${this.frontendUrl}">
              <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .warning { color: #ed6c02; background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; }
              </style>
            </head>
            <body style="background: #fff3e0;">
              <div class="warning">
                <h1>ℹ Ya estás matriculado</h1>
                <p>Ya te encuentras matriculado en esta clase.</p>
              </div>
            </body>
          </html>
        `;
      } else if (isClassFull) {
        html = `
          <html>
            <head>
              <title>Clase Completa</title>
              <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .error { color: #d32f2f; background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; }
              </style>
            </head>
            <body style="background: #ffebee;">
              <div class="error">
                <h1> Clase Completa</h1>
                <p>Esta clase ya ha alcanzado el máximo de estudiantes permitidos.</p>
              </div>
            </body>
          </html>
        `;
      } else if (isNotStudent) {
        html = `
          <html>
            <head>
              <title>Acceso Denegado</title>
              <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .error { color: #d32f2f; background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; }
              </style>
            </head>
            <body style="background: #ffebee;">
              <div class="error">
                <h1> Acceso Denegado</h1>
                <p>Solo los estudiantes pueden matricularse en clases.</p>
              </div>
            </body>
          </html>
        `;
      } else {
        html = `
          <html>
            <head>
              <title>Error</title>
              <style>
                body { font-family: Arial; text-align: center; padding: 50px; }
                .error { color: #d32f2f; background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; }
              </style>
            </head>
            <body style="background: #ffebee;">
              <div class="error">
                <h1> Error</h1>
                <p>${errorMessage}</p>
              </div>
            </body>
          </html>
        `;
      }

      return res.status(HttpStatus.BAD_REQUEST).send(html);
    }
  }
}

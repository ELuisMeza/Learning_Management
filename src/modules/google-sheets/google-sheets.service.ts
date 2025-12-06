import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ExportEvaluationDto } from './dto/export-evaluation.dto';
import { EvaluationResultsService } from '../evaluation-results/evaluation-results.service';
import { EvaluationsService } from '../evaluations/evaluations.service';

@Injectable()
export class GoogleSheetsService {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly evaluationResultsService: EvaluationResultsService,
    private readonly evaluationsService: EvaluationsService,
  ) {
    // Inicializar OAuth2 Client con credenciales del .env
    // El redirect URI debe apuntar al frontend, no al backend
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5173/google-sheets/callback',
    );
  }

  /**
   * Generar URL de autenticación OAuth2
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ];

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Forzar consentimiento para obtener refresh token
    });

    return url;
  }

  /**
   * Intercambiar código de autorización por tokens
   */
  async getTokensFromCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new BadRequestException('No se pudo obtener el token de acceso');
      }

      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
      };
    } catch (error) {
      console.error('Error al obtener tokens:', error);
      throw new InternalServerErrorException('Error al autenticar con Google');
    }
  }

  /**
   * Configurar cliente OAuth2 con tokens
   */
  setCredentials(accessToken: string, refreshToken?: string): void {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  /**
   * Refrescar token de acceso
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await this.oauth2Client.refreshAccessToken();
    
    if (!credentials.access_token) {
      throw new BadRequestException('No se pudo refrescar el token de acceso');
    }

    return credentials.access_token;
  }

  /**
   * Crear nueva hoja de cálculo
   */
  async createSpreadsheet(title: string, accessToken: string): Promise<string> {
    try {
      this.setCredentials(accessToken);
      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

      // Crear nueva hoja de cálculo
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title,
          },
        },
      });

      if (!spreadsheet.data.spreadsheetId) {
        throw new InternalServerErrorException('No se pudo crear la hoja de cálculo');
      }

      const spreadsheetId = spreadsheet.data.spreadsheetId;

      // Compartir con el usuario autenticado (opcional, para que tenga acceso)
      // Esto ya está implícito porque el usuario creó la hoja

      return spreadsheetId;
    } catch (error) {
      console.error('Error al crear hoja de cálculo:', error);
      throw new InternalServerErrorException('Error al crear la hoja de cálculo en Google Sheets');
    }
  }

  /**
   * Exportar resultados de evaluación a Google Sheets
   */
  async exportEvaluationResults(
    exportDto: ExportEvaluationDto,
    accessToken: string,
    refreshToken?: string,
  ): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
    try {
      // Configurar credenciales
      this.setCredentials(accessToken, refreshToken);

      // Obtener resultados de la evaluación
      const results = await this.evaluationResultsService.getResultsByEvaluationId(
        exportDto.evaluationId,
      );

      if (!results || results.length === 0) {
        throw new BadRequestException('No hay resultados para exportar');
      }

      // Obtener información de la evaluación
      const evaluation = await this.evaluationsService.getByIdWithRelations(exportDto.evaluationId);
      if (!evaluation) {
        throw new BadRequestException('Evaluación no encontrada');
      }

      // Preparar datos para la hoja
      const sheetData = [
        // Encabezados
        ['N°', 'Evaluador', 'Evaluado', 'Puntuación Total', 'Comentarios', 'Fecha de Envío'],
        // Datos
        ...results.map((result, index) => [
          index + 1,
          result.evaluator?.name && result.evaluator?.lastNameFather
            ? `${result.evaluator.name} ${result.evaluator.lastNameFather}`
            : 'N/A',
          result.evaluated?.name && result.evaluated?.lastNameFather
            ? `${result.evaluated.name} ${result.evaluated.lastNameFather}`
            : 'N/A',
          result.totalScore,
          result.comments || '-',
          new Date(result.submittedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        ]),
      ];

      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      let spreadsheetId = exportDto.spreadsheetId;

      // Crear nueva hoja si no se proporciona ID
      if (!spreadsheetId && exportDto.createNew !== false) {
        const title = `Resultados_${evaluation.name}_${new Date().toISOString().split('T')[0]}`;
        spreadsheetId = await this.createSpreadsheet(title, accessToken);
      }

      if (!spreadsheetId) {
        throw new BadRequestException('Se requiere spreadsheetId o crear nueva hoja');
      }

      const sheetName = exportDto.sheetName || 'Resultados';

      // Verificar si la hoja existe, si no, crearla
      try {
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetExists = spreadsheet.data.sheets?.some(
          (sheet) => sheet.properties?.title === sheetName,
        );

        if (!sheetExists) {
          // Crear nueva hoja
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: sheetName,
                    },
                  },
                },
              ],
            },
          });
        }
      } catch (error) {
        // Si hay error al verificar, intentar crear la hoja de todos modos
        console.warn('Error al verificar hoja existente:', error);
      }

      // Limpiar contenido existente y escribir nuevos datos
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!A1:Z1000`,
      });

      // Escribir datos
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: sheetData,
        },
      });

      // Formatear encabezados (negrita)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: await this.getSheetId(sheets, spreadsheetId, sheetName),
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                    },
                    backgroundColor: {
                      red: 0.9,
                      green: 0.9,
                      blue: 0.9,
                    },
                  },
                },
                fields: 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor',
              },
            },
          ],
        },
      });

      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

      return {
        spreadsheetId,
        spreadsheetUrl,
      };
    } catch (error) {
      console.error('Error al exportar a Google Sheets:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al exportar resultados a Google Sheets');
    }
  }

  /**
   * Obtener ID de la hoja por nombre
   */
  private async getSheetId(
    sheets: any,
    spreadsheetId: string,
    sheetName: string,
  ): Promise<number> {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(
      (s: any) => s.properties?.title === sheetName,
    );
    return sheet?.properties?.sheetId || 0;
  }

  /**
   * Verificar estado de autenticación (simplificado - en producción debería verificar tokens válidos)
   */
  async checkAuthStatus(accessToken?: string): Promise<{ authenticated: boolean; message: string }> {
    if (!accessToken) {
      return {
        authenticated: false,
        message: 'No hay token de acceso. Por favor, autentícate con Google.',
      };
    }

    try {
      this.setCredentials(accessToken);
      // Intentar hacer una llamada simple para verificar el token
      const sheets = google.sheets({ version: 'v4', auth: this.oauth2Client });
      // No hacemos una llamada real, solo verificamos que el cliente esté configurado
      return {
        authenticated: true,
        message: 'Autenticado con Google Sheets',
      };
    } catch (error) {
      return {
        authenticated: false,
        message: 'Token inválido o expirado. Por favor, vuelve a autenticarte.',
      };
    }
  }
}


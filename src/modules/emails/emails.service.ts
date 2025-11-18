import { Injectable, Logger } from '@nestjs/common';
import { createEmailTransporter, emailConfig } from '../../config/email.config';
import * as nodemailer from 'nodemailer';
import { SendEmailOptions } from './dto/SendEmailOptions.dto';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private transporter: nodemailer.Transporter;

  private readonly frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:3000';
  private readonly fromName: string = process.env.EMAIL_FROM_NAME || 'Learning Management System';
  private readonly fromAddress: string = process.env.EMAIL_FROM_ADDRESS || 'testing.110106@gmail.com';

  constructor() {
    this.transporter = createEmailTransporter();
    this.verifyConnection();
  }

  /**
   * Verifica la conexión con el servidor de correo
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión con el servidor de correo verificada exitosamente');
    } catch (error) {
      this.logger.warn('Servicio de correo no configurado correctamente. Los emails no se enviarán.');
      this.logger.warn('Para habilitar el envío de emails, configura las credenciales de Gmail en el archivo .env');
      this.logger.warn('Variables requeridas: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS');
      // No lanzamos el error, solo lo registramos como advertencia
    }
  }

  /**
   * Envía un correo electrónico
   * @param options Opciones del correo a enviar
   * @returns Información del correo enviado
   */
  async sendEmail(options: SendEmailOptions): Promise<nodemailer.SentMessageInfo> {
    const { to, subject, html, text, attachments } = options;

    // Validar que haya contenido (html o text)
    if (!html && !text) {
      throw new Error('Debe proporcionar contenido HTML o texto para el correo');
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: `${this.fromName} <${this.fromAddress}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text,
      attachments,
    };

    // Intentar enviar el correo
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Correo enviado exitosamente a: ${to}`);
      return info;
    } catch (error) {
      // Si falla, solo loguear como advertencia pero no lanzar error
      // Esto permite que la aplicación continúe funcionando aunque el email no esté configurado
      this.logger.warn(`⚠️  No se pudo enviar el correo a: ${to}. El servicio de correo puede no estar configurado correctamente.`);
      this.logger.warn('La aplicación continuará funcionando normalmente, pero los emails no se enviarán.');
      // Retornar un objeto simulado para que no falle el código que espera una respuesta
      return { messageId: 'email-not-sent', accepted: [], rejected: [] } as nodemailer.SentMessageInfo;
    }
  }

  /**
   * Envía un correo de bienvenida
   * @param email Dirección de correo del destinatario
   * @param name Nombre del usuario
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">¡Bienvenido a Learning Management!</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
          <p>Hola <strong>${name}</strong>,</p>
          <p>¡Nos complace darte la bienvenida a nuestro Sistema de Gestión de Aprendizaje!</p>
          <p>Tu cuenta ha sido creada exitosamente y ya puedes comenzar a utilizar todas las funcionalidades que ofrecemos.</p>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          <br>
          <p>Saludos cordiales,<br><strong>Equipo de Learning Management</strong></p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Bienvenido a Learning Management',
      html,
    });
  }

  /**
   * Envía un correo de recuperación de contraseña
   * @param email Dirección de correo del destinatario
   * @param resetToken Token de recuperación
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Recuperación de Contraseña</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
          <p>Hola,</p>
          <p>Has solicitado recuperar tu contraseña en Learning Management.</p>
          <p>Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
          </div>
          <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #2196F3;">${resetUrl}</p>
          <p><strong>Este enlace expirará en 1 hora.</strong></p>
          <p>Si no solicitaste recuperar tu contraseña, puedes ignorar este correo de forma segura.</p>
          <br>
          <p>Saludos cordiales,<br><strong>Equipo de Learning Management</strong></p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Recuperación de Contraseña - Learning Management',
      html,
    });
  }

  /**
   * Envía un correo de notificación de calificación
   * @param email Dirección de correo del estudiante
   * @param studentName Nombre del estudiante
   * @param evaluationName Nombre de la evaluación
   * @param score Calificación obtenida
   */
  async sendGradeNotificationEmail(
    email: string,
    studentName: string,
    evaluationName: string,
    score: number,
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Calificación</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0;">Nueva Calificación Publicada</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
          <p>Hola <strong>${studentName}</strong>,</p>
          <p>Te informamos que se ha publicado una nueva calificación en tu cuenta.</p>
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #FF9800;">
            <p style="margin: 5px 0;"><strong>Evaluación:</strong> ${evaluationName}</p>
            <p style="margin: 5px 0;"><strong>Calificación:</strong> <span style="font-size: 24px; color: #FF9800;">${score}</span></p>
          </div>
          <p>Puedes revisar más detalles en tu cuenta de Learning Management.</p>
          <br>
          <p>Saludos cordiales,<br><strong>Equipo de Learning Management</strong></p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Nueva Calificación - Learning Management',
      html,
    });
  }
}


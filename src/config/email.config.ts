import * as dotenv from 'dotenv';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Validar que las variables de entorno requeridas estén definidas
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Variables de entorno faltantes para email: ${missingVars.join(', ')}`);
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    address: string;
  };
}

export const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Learning Management System',
    address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER!,
  },
};

export const createEmailTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });
};


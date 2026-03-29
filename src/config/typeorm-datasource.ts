import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import {
  assertDatabaseEnvConfigured,
  getCliDatabaseUrl,
  hasDiscreteDbConfig,
} from './database-env';

assertDatabaseEnvConfigured(true);

const schema = process.env.DB_SCHEMA || 'public';
const cliUrl = getCliDatabaseUrl();

const common = {
  type: 'postgres' as const,
  schema,
  entities: [path.resolve(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [path.resolve(__dirname, '../migrations/*.{ts,js}')],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
};

export default new DataSource(
  cliUrl
    ? {
        ...common,
        url: cliUrl,
      }
    : hasDiscreteDbConfig()
      ? {
          ...common,
          host: process.env.DB_HOST as string,
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME as string,
          password: process.env.DB_PASSWORD as string,
          database: process.env.DB_NAME as string,
        }
      : (() => {
          throw new Error('Configuración de base de datos incompleta.');
        })(),
);

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  assertDatabaseEnvConfigured,
  getAppDatabaseUrl,
  hasDiscreteDbConfig,
} from './database-env';

assertDatabaseEnvConfigured(false);

const schema = process.env.DB_SCHEMA || 'public';

const base: TypeOrmModuleOptions = {
  type: 'postgres',
  schema,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  extra: {
    timezone: 'UTC',
    parseInputDatesAsUTC: true,
  },
};

const appUrl = getAppDatabaseUrl();

export const typeOrmConfig: TypeOrmModuleOptions = appUrl
  ? { ...base, url: appUrl }
  : hasDiscreteDbConfig()
    ? {
        ...base,
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
      }
    : (() => {
        throw new Error('Configuración de base de datos incompleta.');
      })();

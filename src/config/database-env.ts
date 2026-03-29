import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/** URL para la app (pooler de Neon u otro PgBouncer). */
export function getAppDatabaseUrl(): string | undefined {
  const u =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL?.trim();
  return u || undefined;
}

/** URL directa para migraciones/seeds (sin pooler). */
export function getCliDatabaseUrl(): string | undefined {
  const u =
    process.env.DATABASE_URL_UNPOOLED?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    getAppDatabaseUrl();
  return u || undefined;
}

export function hasDiscreteDbConfig(): boolean {
  return (
    !!process.env.DB_HOST?.trim() &&
    !!process.env.DB_USERNAME?.trim() &&
    !!process.env.DB_PASSWORD?.trim() &&
    !!process.env.DB_NAME?.trim()
  );
}

export function assertDatabaseEnvConfigured(forCli: boolean): void {
  const url = forCli ? getCliDatabaseUrl() : getAppDatabaseUrl();
  if (url || hasDiscreteDbConfig()) return;
  throw new Error(
    forCli
      ? 'Define DATABASE_URL_UNPOOLED o DATABASE_URL (o POSTGRES_URL_NON_POOLING / POSTGRES_PRISMA_URL), o bien DB_HOST, DB_USERNAME, DB_PASSWORD y DB_NAME.'
      : 'Define DATABASE_URL (o POSTGRES_PRISMA_URL / POSTGRES_URL) o bien DB_HOST, DB_USERNAME, DB_PASSWORD y DB_NAME.',
  );
}

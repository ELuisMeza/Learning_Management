## Descripción

API de gestión de aprendizaje construida con NestJS, TypeORM y PostgreSQL.

Incluye migraciones y seeds para facilitar la puesta en marcha por cualquier colaborador.

## Requisitos

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 13
- Acceso para crear extensiones en la base de datos (`pgcrypto`)

## Configuración del entorno

1. Copia el archivo `.env` (crear si no existe) en la raíz del proyecto y define:

```bash
JWT_SECRET=Tu_llave_secreta
PORT=Puerto_donde_se_desplegara
DB_HOST=localhost
DB_PORT=5432               
DB_USERNAME=postgres
DB_PASSWORD=contraseña
DB_NAME=nombre_de_tu_tabla
DB_SCHEMA=public 
```

2. Asegúrate de que la base de datos `DB_NAME` exista en tu servidor PostgreSQL.

## Instalación

```bash
npm install
```

## Migraciones (TypeORM)

El proyecto ya incluye una migración inicial que crea todos los tipos y tablas en el orden correcto.

- Ejecutar migraciones:

```bash
npm run migration:run
```

- Revertir la última migración (opcional):

```bash
npm run migration:revert
```

## Seeds (datos iniciales)

Se incluye un script de seed que inserta:
- Roles base: Administrador, Docente, Estudiante
- Usuario administrador por defecto (email: `admin@example.com`, password: `admin123`)

Ejecutar seed:

```bash
npm run seed
```

## Ejecución de la aplicación

- Desarrollo:

```bash
npm run start:dev
```

- Producción (requiere build previo):

```bash
npm run build
npm run start:prod
```

## Comandos útiles

- Ejecutar CLI de TypeORM con la configuración del proyecto:

```bash
npm run typeorm -- -h
```

- Generar una nueva migración (ejemplo):

```bash
npm run typeorm -- migration:generate src/migrations/NombreMigracion
```

> Nota: recomendamos preferir migraciones manuales para cambios controlados en esquemas complejos.

## Estructura relevante

- Migraciones: `src/migrations`
- Seeds: `src/seeds/seed.ts`
- DataSource CLI: `src/config/typeorm-datasource.ts`
- Config DB para Nest: `src/config/database.config.ts`
- SQL de referencia: `documentation/create` y `documentation/insert`

## Notas de compatibilidad

- Los enums de base de datos se normalizaron a inglés para coincidir con los enums del código (`active/inactive`, `in_person/online/hybrid`, etc.).
- La migración inicial habilita `pgcrypto` para usar `gen_random_uuid()`.

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

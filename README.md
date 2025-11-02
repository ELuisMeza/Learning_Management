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

# Configuración de correo electrónico (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM_NAME=Learning Management System
EMAIL_FROM_ADDRESS=tu_email@gmail.com

# URL del frontend (para enlaces en correos)
FRONTEND_URL=http://localhost:3000

# Configuración de Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
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

## Servicio de Emails

El proyecto incluye un servicio de correo electrónico configurado con Nodemailer que permite:

- **Enviar correos personalizados** con opciones de HTML y texto plano
- **Enviar correos de bienvenida** para nuevos usuarios
- **Enviar correos de recuperación de contraseña**
- **Enviar notificaciones de calificaciones** a estudiantes

### Configuración

Asegúrate de tener configuradas las variables de entorno necesarias en tu archivo `.env` (ver sección de configuración arriba).

### Uso del Servicio

```typescript
import { EmailsService } from './modules/emails/emails.service';

// Inyectar el servicio en tu controlador o servicio
constructor(private readonly emailsService: EmailsService) {}

// Enviar correo de bienvenida
await this.emailsService.sendWelcomeEmail('usuario@example.com', 'Juan Pérez');

// Enviar correo de recuperación de contraseña
await this.emailsService.sendPasswordResetEmail('usuario@example.com', 'token-reset');

// Enviar notificación de calificación
await this.emailsService.sendGradeNotificationEmail('estudiante@example.com', 'María García', 'Examen Final', 85);

// Enviar correo personalizado
await this.emailsService.sendEmail({
  to: 'destinatario@example.com',
  subject: 'Asunto del correo',
  html: '<h1>Contenido HTML</h1>',
  text: 'Contenido en texto plano',
});
```

## Autenticación con Google OAuth

El proyecto incluye autenticación con Google OAuth2 que permite a los usuarios iniciar sesión utilizando su cuenta de Google.

### Configuración

1. **Crear credenciales de Google**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la API de Google+
   - Ve a "Credenciales" y crea un ID de cliente OAuth 2.0
   - Configura las URLs de redirección autorizadas (ej: `http://localhost:3001/auth/google/callback`)

2. **Configura las variables de entorno** en tu archivo `.env` (ver sección de configuración arriba):
   - `GOOGLE_CLIENT_ID`: Tu Client ID de Google
   - `GOOGLE_CLIENT_SECRET`: Tu Client Secret de Google
   - `GOOGLE_CALLBACK_URL`: URL de callback (ej: `http://localhost:3001/auth/google/callback`)

### Endpoints

- **GET `/auth/google`**: Inicia el flujo de autenticación con Google (redirecciona al login de Google)
- **GET `/auth/google/callback`**: Callback de Google que procesa la respuesta y retorna el JWT

### Funcionamiento

1. Los usuarios son redirigidos a Google para autenticarse
2. Después de autenticarse, Google redirige de vuelta a tu aplicación
3. Si el usuario no existe en la base de datos, se crea automáticamente con el rol de "Estudiante"
4. Se retorna un JWT que puede ser usado para autenticarse en endpoints protegidos

### Personalización

Puedes personalizar el rol por defecto para nuevos usuarios modificando el método `findOrCreateGoogleUser` en `src/modules/users/users.service.ts`.

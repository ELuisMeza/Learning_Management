/**
 * DTO para el perfil de usuario de Google OAuth
 */
export interface GoogleProfileDto {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  googleId: string;
}


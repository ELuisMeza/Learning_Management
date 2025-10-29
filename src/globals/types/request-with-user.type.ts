import { Request } from 'express';

export interface UserFromJwt {
  userId: string;
  email: string;
  roleId: string;
}

export interface RequestWithUser extends Request {
  user: UserFromJwt;
}


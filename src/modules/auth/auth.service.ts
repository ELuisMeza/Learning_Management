
import { Injectable, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('No user from Google');
    }

    const dbUser = await this.usersService.findGoogleUser(user);
    const payload: JwtPayload = { sub: dbUser.id, email: dbUser.email, roleId: dbUser.roleId };
    const access_token = await this.jwtService.signAsync(payload);
    
    return { access_token, user: dbUser };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload: JwtPayload = { sub: user.id, email: user.email, roleId: user.roleId };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user };
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}



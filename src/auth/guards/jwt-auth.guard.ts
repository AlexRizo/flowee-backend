import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw err;
    }

    if (!user) {
      const raw = typeof info === 'string' ? info : info?.message; // 'No auth token', 'jwt expired', etc.

      let message = 'Unauthorized';
      if (typeof raw === 'string') {
        const r = raw.toLowerCase();
        if (r.includes('no auth token')) message = 'Acceso denegado';
        else if (r.includes('jwt expired'))
          message = 'El token expiró, inicia sesión de nuevo';
        else if (r.includes('invalid token')) message = 'Token no válido';
        else message = raw; // opcional: conserva el original si no lo mapeas
      }

      throw new UnauthorizedException(message);
    }

    return user;
  }
}

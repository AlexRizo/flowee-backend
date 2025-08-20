import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../interfaces/auth-decorator.interface';
import { Role } from './role.decorator';
import { UserRoleGuard } from '../guards/user-role.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const Auth = (...roles: Roles[]) => {
  return applyDecorators(
    Role(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard),
  );
};

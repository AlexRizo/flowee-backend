import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../interfaces/auth-decorator.interface';
import { Role } from './role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

export const Auth = (...roles: Roles[]) => {
  return applyDecorators(Role(...roles), UseGuards(AuthGuard(), UserRoleGuard));
};

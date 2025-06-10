import { SetMetadata } from '@nestjs/common';
import { Roles } from '../interfaces/auth-decorator.interface';

export const META_ROLES = 'roles';

export const Role = (...args: Roles[]) => {
  return SetMetadata(META_ROLES, args);
};

import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

type Data = 'id' | 'email' | 'nickname' | undefined;

export const GetUser = createParamDecorator(
  (data: Data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new InternalServerErrorException('Usuario no encontrado');

    return !data ? user : user[data];
  },
);

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        name: true,
        nickname: true,
        roles: true,
        isActive: true,
        avatar: true,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Usuario y/o contraseña incorrectos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Cuenta suspendida. Si cree que es un error, contacte con el administrador.',
      );
    }

    delete user.password;

    const payload = {
      nickname: user.nickname,
      id: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, //? 1 día;
      sameSite: process.env.SAMESITE as 'lax' | 'strict' | 'none', //? Para evitar ataques CSRF
    });

    return { user };
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    return { message: 'Sesión terminada' };
  }

  checkAuth(res: Response, user: User) {
    const { id, email, nickname, avatar, roles, isActive, name } = user;

    const checkToken = this.jwtService.sign({
      id,
      email,
      nickname,
    });

    res.cookie('access_token', checkToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, //? 1 día;
      sameSite: 'lax', //? Para evitar ataques CSRF
    });

    return {
      user: {
        id,
        name,
        nickname,
        email,
        avatar,
        roles,
        isActive,
      },
    };
  }
}

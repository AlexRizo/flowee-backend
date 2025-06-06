import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(term: string) {
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({
        id: term,
      });
    }

    if (!user) {
      user = await this.userRepository.findOneBy({ nickname: term });
    }

    if (!user) {
      throw new NotFoundException(
        `Usuario con id/nickname ${term} no encontrado`,
      );
    }

    return user;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      if (error.detail.includes('email')) {
        throw new BadRequestException('El correo electrónico ya existe');
      }
      if (error.detail.includes('nickname')) {
        throw new BadRequestException('El nickname ya está en uso');
      }
      throw new BadRequestException(error.detail);
    }
    console.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, revise los logs del servidor',
    );
  }
}

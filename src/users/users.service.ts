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
import { BoardsService } from 'src/boards/boards.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Board } from 'src/boards/entities/board.entity';
import * as sharp from 'sharp';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly boardsService: BoardsService,

    private readonly cloudinaryService: CloudinaryService,
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

      return {
        user,
        message: 'Usuario creado correctamente',
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, { boards, ...updateUserDto }: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['boards'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (boards) {
      await this.checkBoards(boards);
      user.boards = boards.map(boardId => ({ id: boardId }) as Board);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return {
      user: updatedUser,
      message: 'Usuario actualizado correctamente',
    };
  }

  async uploadAvatar(file: Express.Multer.File, term: string) {
    try {
      const user = await this.findOne(term);

      const resized = await sharp(file.buffer)
        .resize(128, 128, {
          fit: 'cover',
          position: 'center',
        })
        .webp()
        .toBuffer();

      const result = await this.cloudinaryService.uploadBuffer(
        resized,
        'avatars',
        'avatar',
      );

      await this.userRepository.update(user.id, { avatar: result.secure_url });

      return {
        url: result.secure_url,
        message: 'Avatar actualizado correctamente',
      };
    } catch (error) {
      console.error('Error al actualizar el avatar', error);
      throw new InternalServerErrorException('No se pudo actualizar el avatar');
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return { users };
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { nickname: term };

    const user = await this.userRepository.findOne({
      where,
      relations: ['boards'],
    });

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

  private async checkBoards(boards: string[]) {
    const foundBoards = await this.boardsService.findByIds(boards);
    const foundIds = new Set(foundBoards.map(board => board.id));

    for (const boardId of boards) {
      if (!foundIds.has(boardId)) {
        throw new NotFoundException(
          `El tablero con el id ${boardId} no existe`,
        );
      }
    }
  }
}

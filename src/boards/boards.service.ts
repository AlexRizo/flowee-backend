import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    try {
      const board = this.boardRepository.create(createBoardDto);
      await this.boardRepository.save(board);

      return { board };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(user: User) {
    const { roles } = user;
    let boards: Board[] = [];

    if (roles.includes(Roles.ADMIN) || roles.includes(Roles.READER)) {
      boards = await this.boardRepository.find();
    }

    if (roles.includes(Roles.DESIGNER) || roles.includes(Roles.PUBLISHER)) {
      boards = await this.boardRepository.find({
        where: { users: { id: user.id } },
      });
    }

    if (!boards.length) {
      throw new NotFoundException('No se encontraron tableros');
    }

    return { boards };
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      if (error.detail.includes('slug')) {
        throw new BadRequestException('El slug ya existe');
      }
      if (error.detail.includes('prefix')) {
        throw new BadRequestException('El prefijo ya existe');
      }
      if (error.detail.includes('name')) {
        throw new BadRequestException('El nombre ya existe');
      }

      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}

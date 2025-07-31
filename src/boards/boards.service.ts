import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { In, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { isUUID } from 'class-validator';

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
    let boards: Board[] = null;

    const isAdmin =
      roles.includes(Roles.ADMIN) ||
      roles.includes(Roles.SUPER_ADMIN) ||
      roles.includes(Roles.READER);

    if (isAdmin) {
      boards = await this.boardRepository.find();
    } else {
      boards = await this.boardRepository.find({
        where: { users: { id: user.id } },
      });
    }

    if (!boards) {
      throw new NotFoundException('No se encontraron tableros.');
    }

    return { boards };
  }

  async findOne(term: string) {
    let board: Board;

    if (isUUID(term)) {
      board = await this.boardRepository.findOneBy({ id: term });
    }

    if (!board) {
      board = await this.boardRepository.findOneBy({ slug: term });
    }

    if (!board) {
      throw new NotFoundException(`Tablero con el ${term} no encontrado`);
    }

    return board;
  }

  findByIds(ids: string[]) {
    return this.boardRepository.findBy({ id: In(ids) });
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    console.log(updateBoardDto);
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

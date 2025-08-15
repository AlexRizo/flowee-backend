import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { isUUID } from 'class-validator';
import { Status } from './utils/utils';
import { BoardsService } from 'src/boards/boards.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly boardService: BoardsService,
  ) {}

  async findBoardTasks(boardTerm: string, { roles, id: userId }: User) {
    await this.boardService.findOne(boardTerm);

    const isAdmin =
      roles.includes(Roles.ADMIN) ||
      roles.includes(Roles.SUPER_ADMIN) ||
      roles.includes(Roles.READER);

    const isManager =
      roles.includes(Roles.DESIGN_MANAGER) ||
      roles.includes(Roles.PUBLISHER_MANAGER);

    const boardCondition = isUUID(boardTerm)
      ? { board: { id: boardTerm } }
      : { board: { slug: boardTerm } };

    let tasks: Task[];

    if (isAdmin || isManager) {
      tasks = await this.taskRepository.find({
        where: boardCondition,
        relations: ['author', 'assignedTo', 'board'],
      });
    } else {
      tasks = await this.taskRepository.find({
        where: [
          { ...boardCondition, assignedTo: { id: userId } },
          { ...boardCondition, author: { id: userId } },
        ],
        relations: ['author', 'assignedTo', 'board'],
      });
    }

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No se encontraron tareas');
    }

    return tasks;
  }

  async findBoardPendingTasks(boardTerm: string) {
    await this.boardService.findOne(boardTerm);

    const boardCondition = isUUID(boardTerm)
      ? { board: { id: boardTerm } }
      : { board: { slug: boardTerm } };

    const tasks = await this.taskRepository.find({
      where: { ...boardCondition, status: Status.AWAIT },
      relations: ['author', 'assignedTo', 'board'],
    });

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No se encontraron tareas pendientes');
    }

    return tasks;
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) throw new NotFoundException('La tarea no existe');

    return task;
  }

  async updateStatus(id: string, status: Status) {
    const task = await this.findOne(id);

    task.status = status;

    return this.taskRepository.save(task);
  }
}

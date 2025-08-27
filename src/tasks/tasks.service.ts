import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { isUUID } from 'class-validator';
import { Status } from './utils/utils';
import { BoardsService } from 'src/boards/boards.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly boardService: BoardsService,
    private readonly userService: UsersService,
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
      where: { ...boardCondition, status: Status.AWAIT, assignedTo: IsNull() },
      relations: ['author', 'assignedTo', 'board'],
    });

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No se encontraron tareas pendientes');
    }

    return tasks;
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['author', 'board'],
    });

    if (!task) throw new NotFoundException('La tarea no existe');

    return task;
  }

  async updateStatus(id: string, status: Status) {
    const task = await this.findOne(id);

    task.status = status;
    await this.taskRepository.save(task);

    return {
      task,
      message: 'Estado de la tarea actualizado correctamente',
    };
  }

  async assignTask(id: string, designerId: string, rewrite: boolean = false) {
    const task = await this.findOne(id);

    if (task.assignedTo && !rewrite) {
      throw new BadRequestException('La tarea ya tiene un diseñador asignado');
    }

    const designer = await this.userService.findOne(designerId);

    if (!designer || !designer.isActive) {
      throw new NotFoundException('El diseñador no existe o está inactivo');
    }

    try {
      task.assignedTo = designer;
      await this.taskRepository.save(task);

      return {
        message: 'Tarea asignada correctamente',
        task,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al asignar la tarea');
    }
  }

  async findAllUserTasks(user: User) {
    await this.userService.findOne(user.id);

    const pendingTasks = await this.taskRepository.find({
      where: { assignedTo: { id: user.id }, status: Not(Status.DONE) },
      relations: ['author', 'assignedTo', 'board'],
    });

    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const doneTasks = await this.taskRepository.find({
      where: {
        assignedTo: { id: user.id },
        status: Status.DONE,
        createdAt: MoreThan(fourDaysAgo),
      },
      relations: ['author', 'assignedTo', 'board'],
    });

    if (!pendingTasks.length && !doneTasks.length) {
      throw new NotFoundException('No se encontraron tareas');
    }

    return {
      pendingTasks,
      doneTasks,
    };
  }
}

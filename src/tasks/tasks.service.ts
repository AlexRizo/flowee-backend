import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { isUUID } from 'class-validator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findBoardTasks(boardTerm: string, { roles, id: userId }: User) {
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
        // relations: ['author', 'assignedTo'],
      });
    } else {
      tasks = await this.taskRepository.find({
        where: [
          { ...boardCondition, assignedTo: { id: userId } },
          { ...boardCondition, author: { id: userId } },
        ],
        // relations: ['author', 'assignedTo'],
      });
    }

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No se encontraron tareas');
    }

    return tasks;
  }
}

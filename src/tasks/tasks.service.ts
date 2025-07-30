import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { isUUID } from 'class-validator';
import { CreateSpecialTaskDto } from './dto/create-special-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createSpecialTask(createSpecialTaskDto: CreateSpecialTaskDto) {
    try {
      const task = this.taskRepository.create(createSpecialTaskDto);
      await this.taskRepository.save(task);

      return { task };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findBoardTasks(term: string) {
    let tasks: Task[];

    if (isUUID(term)) {
      tasks = await this.taskRepository.findBy({ board: { id: term } });
    }

    if (!tasks) {
      tasks = await this.taskRepository.findBy({ board: { slug: term } });
    }

    if (!tasks) {
      throw new NotFoundException(
        `No se encontraron tareas con el término: ${term}`,
      );
    }

    return { tasks };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }

  private handleDBExceptions(error: any) {
    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}

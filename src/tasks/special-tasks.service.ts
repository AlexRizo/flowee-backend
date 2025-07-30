import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { isUUID } from 'class-validator';
import { CreateSpecialTaskDto } from './dto/create-special-task.dto';
import { SpecialTask } from './entities/special-task.entity';

@Injectable()
export class SpecialTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(SpecialTask)
    private readonly specialTaskRepository: Repository<SpecialTask>,
  ) {}

  async createSpecialTask(TaskDto: CreateSpecialTaskDto) {
    const { idea, sizes, legals, ...baseTask } = TaskDto;

    try {
      const task = this.taskRepository.create(baseTask);
      await this.taskRepository.save(task);

      const specialTask = this.specialTaskRepository.create({
        idea,
        sizes,
        legals,
        task,
      });
      await this.specialTaskRepository.save(specialTask);

      return { ...task, specialTask };
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

  private handleDBExceptions(error: any) {
    console.log(error);
    throw new InternalServerErrorException('Unexpected error, check logs');
  }
}

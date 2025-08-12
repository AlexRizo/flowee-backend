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
import { UsersService } from 'src/users/users.service';
import { BoardsService } from 'src/boards/boards.service';
import { instanceToPlain } from 'class-transformer';
import { FilesPayload } from 'src/files/pipes/files-payload.pipe';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class SpecialTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(SpecialTask)
    private readonly specialTaskRepository: Repository<SpecialTask>,

    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
    private readonly boardsService: BoardsService,
  ) {}

  async createSpecialTask(TaskDto: CreateSpecialTaskDto, files: FilesPayload) {
    const { sizes, legals, authorId, assignedToId, boardId, ...baseTask } =
      TaskDto;

    const author = await this.usersService.findOne(authorId);
    const assignedTo = await this.usersService.findOne(assignedToId);
    const board = await this.boardsService.findOne(boardId);

    try {
      const task = this.taskRepository.create({
        ...baseTask,
        author,
        assignedTo,
        board,
      });
      await this.taskRepository.save(task);

      const specialTask = this.specialTaskRepository.create({
        sizes,
        legals,
        task,
      });

      await this.specialTaskRepository.save(specialTask);

      const uploadFilesResponse = await this.filesService.createTaskFiles(
        files,
        task.id,
      );

      return {
        task: {
          ...task,
          specialTask: instanceToPlain(specialTask),
        },
        filesResponse: uploadFilesResponse,
      };
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
    throw new InternalServerErrorException(
      'Error inesperado, revise los logs del servidor',
    );
  }
}

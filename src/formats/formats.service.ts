import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFormatDto } from './dto/create-format.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Format } from './entities/format.entity';
import { Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class FormatsService {
  constructor(
    @InjectRepository(Format)
    private readonly formatRepository: Repository<Format>,

    private readonly taskService: TasksService,
  ) {}

  async create({ description, taskId }: CreateFormatDto) {
    await this.taskService.findOne(taskId);

    try {
      const format = this.formatRepository.create({
        description,
        task: { id: taskId },
      });

      await this.formatRepository.save(format);

      return {
        message: 'Formato creado correctamente',
        format,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    const format = await this.formatRepository.findOneBy({ id });

    if (!format) throw new NotFoundException('El formato no existe');

    return format;
  }

  async findOneByTaskId(id: string) {
    await this.taskService.findOne(id);

    const formats = await this.formatRepository.find({
      where: {
        task: { id },
      },
      relations: {
        task: true,
      },
    });

    if (!formats || !formats.length) {
      throw new NotFoundException('La tarea no cuenta con formatos');
    }

    return { formats };
  }
}

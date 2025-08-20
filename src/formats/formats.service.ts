import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFormatDto } from './dto/create-format.dto';
import { UpdateFormatDto } from './dto/update-format.dto';
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
      return await this.formatRepository.save(format);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all formats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} format`;
  }

  update(id: number, updateFormatDto: UpdateFormatDto) {
    return `This action updates a #${id} format`;
  }

  remove(id: number) {
    return `This action removes a #${id} format`;
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,

    private readonly taskService: TasksService,
  ) {}

  async create({ description, taskId }: CreateDeliveryDto) {
    await this.taskService.findOne(taskId);

    try {
      const delivery = this.deliveryRepository.create({
        description,
        task: { id: taskId },
      });

      await this.deliveryRepository.save(delivery);

      return {
        message: 'Entregable creado correctamente',
        delivery,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    const delivery = await this.deliveryRepository.findOneBy({ id });

    if (!delivery) throw new NotFoundException('El entregable no existe');

    return delivery;
  }

  async findByTaskId(id: string) {
    await this.taskService.findOne(id);

    const deliveries = await this.deliveryRepository
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.versions', 'version')
      .where('delivery.taskId = :id', { id })
      .orderBy('delivery.createdAt', 'ASC')
      .addOrderBy('version.createdAt', 'DESC')
      .getMany();

    if (!deliveries.length) {
      throw new NotFoundException('La tarea no cuenta con entregables');
    }

    return { deliveries };
  }
}

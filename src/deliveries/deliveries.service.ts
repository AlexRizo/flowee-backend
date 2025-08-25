import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { FormatsService } from 'src/formats/formats.service';
import { S3Service } from 'src/s3/s3.service';
import { Delivery } from './entities/delivery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDeliveryStatusDto } from './dto/update-status.dto';
import { DeliveryStatus } from './interfaces/deliveries.interface';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,

    private readonly formatService: FormatsService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    { formatId, description }: CreateDeliveryDto,
    file: Express.Multer.File,
  ) {
    await this.formatService.findOne(formatId);

    const upload = await this.s3Service.upload(
      file.buffer,
      'deliveries',
      file.originalname,
      file.mimetype,
    );

    const delivery = this.deliveryRepository.create({
      key: upload.key,
      formatId,
      description,
      filename: file.originalname,
      url: upload.url,
    });

    await this.deliveryRepository.save(delivery);

    return {
      message: 'Entregable creado correctamente',
      delivery,
    };
  }

  findAll() {
    return `This action returns all deliveries`;
  }

  async findOne(id: string) {
    const delivery = await this.deliveryRepository.findOneBy({ id });

    if (!delivery) throw new NotFoundException('El entregable no existe');

    return delivery;
  }

  async updateStatus(
    id: string,
    { status, comments }: UpdateDeliveryStatusDto,
  ) {
    const delivery = await this.findOne(id);

    delivery.status = status;

    if (comments) delivery.comments = comments;

    const message =
      status === DeliveryStatus.ACCEPTED ? 'aceptada' : 'rechazada';

    try {
      await this.deliveryRepository.save(delivery);

      return {
        message: `La entrega ha sido marcada como ${message}`,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al marcar la entrega');
    }
  }
}

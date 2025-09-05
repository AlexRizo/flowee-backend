import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVersionDto } from './dto/create-version.dto';
import { DeliveriesService } from 'src/deliveries/deliveries.service';
import { S3Service } from 'src/s3/s3.service';
import { Version } from './entities/version.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateVersionStatusDto } from './dto/update-status.dto';
import { VersionStatus } from './interfaces/version.interface';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,

    private readonly deliveriesService: DeliveriesService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    { deliveryId, description }: CreateVersionDto,
    file: Express.Multer.File,
  ) {
    await this.deliveriesService.findOne(deliveryId);

    const upload = await this.s3Service.upload(
      file.buffer,
      'versions',
      file.originalname,
      file.mimetype,
    );

    const version = this.versionRepository.create({
      key: upload.key,
      deliveryId,
      description,
      filename: file.originalname,
      url: upload.url,
    });

    await this.versionRepository.save(version);

    return {
      message: 'Versión creada correctamente',
      version,
    };
  }

  findAll() {
    return `This action returns all versions`;
  }

  async findOne(id: string) {
    const version = await this.versionRepository.findOneBy({ id });

    if (!version) throw new NotFoundException('La versión no existe');

    return version;
  }

  async updateStatus(id: string, { status, comments }: UpdateVersionStatusDto) {
    const version = await this.findOne(id);

    version.status = status;

    if (comments) version.comments = comments;

    const message =
      status === VersionStatus.ACCEPTED ? 'aceptada' : 'rechazada';

    try {
      await this.versionRepository.save(version);

      return {
        message: `La versión ha sido marcada como ${message}`,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al marcar la versión');
    }
  }
}

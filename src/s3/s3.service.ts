import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private readonly s3 = new S3Client({
    region: this.configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    },
  });

  private readonly bucketName = this.configService.get('AWS_BUCKET');
  private readonly bucketRegion = this.configService.get('AWS_REGION');
  private readonly secure_url = this.configService.get('AWS_DIST_DOMAIN');

  private buildKey(originalName: string, prefix: string = 'uploads') {
    const ext = path.extname(originalName || '.bin');
    const base = path
      .basename(originalName, ext)
      .replace(/\s+/g, '-')
      .slice(0, 60);
    const stamp = Date.now().toString(36);
    const rand = crypto.randomBytes(3).toString('hex');

    return `${prefix}/${base}-${stamp}-${rand}${ext}`;
  }

  private buildPublicUrl(key: string) {
    if (this.secure_url) return `${this.secure_url}/${key}`;
    return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${key}`;
  }

  async upload(
    buffer: Buffer,
    folder: string,
    originalName: string,
    mimetype: string,
  ) {
    const key = this.buildKey(originalName, folder);
    const contentType = mimetype;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          CacheControl: 'max-age=31536000, public',
          ContentDisposition: 'inline',
        }),
      );

      return {
        key,
        url: this.buildPublicUrl(key),
        message: 'Archivo subido correctamente',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al subir el archivo');
    }
  }

  async deleteFile(key: string) {
    if (!key) {
      throw new BadRequestException('La clave es requerida ?key=ABC/123');
    }

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      return {
        message: 'Archivo eliminado correctamente',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar el archivo');
    }
  }
}

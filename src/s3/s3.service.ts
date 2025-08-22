import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as crypto from 'crypto';
import { S3UploadRejected, S3UploadResult } from './interfaces/s3.interfaces';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    prefix: string,
    originalName: string,
    mimetype: string,
  ) {
    const key = this.buildKey(originalName, prefix);
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
        originalName,
        message: 'Archivo subido correctamente',
      } as S3UploadResult;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al subir el archivo');
    }
  }

  async uploadMany(files: Express.Multer.File[], prefix: string) {
    const uploaded: S3UploadResult[] = [];
    const rejected: S3UploadRejected[] = [];
    let message = 'Archivos subidos correctamente';

    const uploads = files.map(file =>
      this.upload(file.buffer, prefix, file.originalname, file.mimetype),
    );

    const settled = await Promise.allSettled(uploads);

    settled.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        uploaded.push(result.value);
      } else {
        rejected.push({
          originalName: files[i].originalname,
          reason:
            result.reason.message || 'Error desconocido al subir el archivo',
        });
      }
    });

    if (rejected.length) {
      message = 'Algunos archivos no pudieron ser subidos';
    }

    return {
      uploaded,
      rejected,
      message,
    };
  }

  private async assertExists(key: string) {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException('El archivo no existe');
    }
  }

  async signUrlToDownload(
    key: string,
    filename?: string,
    expiresIn: number = 60,
  ) {
    await this.assertExists(key);

    try {
      const safeName = (filename || path.basename(key)).replace(/"/g, '');

      const cmd = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        // ? Para forzar la descarga del archivo;
        ResponseContentDisposition: `attachment; filename="${safeName}"`,
      });

      const signedUrl = await getSignedUrl(this.s3, cmd, {
        expiresIn,
      });

      return { signedUrl };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error al firmar laURL',
      );
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
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar el archivo');
    }
  }
}

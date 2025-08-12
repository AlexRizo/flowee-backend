import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // ? 5MB;

const ALLOWED_MIME_TYPES = [
  // ? tipos de archivos permitidos;
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'text/plain',
  'text/rtf',
];

export type FilesPayload = {
  referenceFiles: Express.Multer.File[];
  includeFiles: Express.Multer.File[];
};

@Injectable()
export class FilesPayloadPipe implements PipeTransform {
  constructor(
    private readonly opts?: {
      requireReference?: boolean;
      requireIncludes?: boolean;
      maxFileSize?: number;
      allowEmptyArrays?: boolean;
      allowedMimeTypes?: string[];
    },
  ) {}

  transform(value: FilesPayload) {
    const ref = value?.referenceFiles ?? [];
    const inc = value?.includeFiles ?? [];

    const missing: string[] = [];

    if (this.opts?.requireReference !== false && ref.length === 0) {
      missing.push('[referenceFiles]');
    }

    if (this.opts?.requireIncludes !== false && inc.length === 0) {
      missing.push('[includesFiles]');
    }

    if (missing.length) {
      throw new BadRequestException(
        `Se esperaban archivos en los campos: ${missing.join(', ')}.`,
      );
    }

    if (this.opts?.allowEmptyArrays === false) {
      if ('referenceFiles' in (value ?? {}) && ref.length === 0) {
        throw new BadRequestException(
          `El campo [referenceFiles] no puede estar vacío.`,
        );
      }

      if ('includesFiles' in (value ?? {}) && inc.length === 0) {
        throw new BadRequestException(
          `El campo [includesFiles] no puede estar vacío.`,
        );
      }
    }

    const maxFileSize = this.opts?.maxFileSize
      ? this.opts.maxFileSize * 1024 * 1024
      : MAX_FILE_SIZE;
    const allowedMimeTypes = this.opts?.allowedMimeTypes ?? ALLOWED_MIME_TYPES;

    const allFiles = [...ref, ...inc];

    for (const file of allFiles) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Tipo de archivo no permitido: ${file.mimetype}.`,
        );
      }

      if (typeof file.size === 'number' && file.size > maxFileSize) {
        throw new BadRequestException(
          `El archivo ${file.originalname} excede el tamaño máximo de ${maxFileSize / 1024 / 1024}Mb.`,
        );
      }
    }

    return value as Required<FilesPayload>;
  }
}

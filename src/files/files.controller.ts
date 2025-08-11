import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const allowedMimeTypes = [
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

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('task/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'referenceFiles', maxCount: 5 },
        { name: 'includesFiles', maxCount: 5 },
      ],
      {
        storage: memoryStorage(),
        // ? si se quiere limitar el tamaño de los archivos antes de subirlos a la memoria, pero el mensaje de error es en inglés;
        // limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: (req, file, cb) => {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new BadRequestException('Tipo de archivo no permitido'), false);
            return; // <- evita llamar cb dos veces
          }

          cb(null, true);
        },
      },
    ),
  )
  createReferenceFiles(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles()
    files: {
      referenceFiles: Express.Multer.File[];
      includesFiles: Express.Multer.File[];
    },
  ) {
    const ref = files.referenceFiles;
    const inc = files.includesFiles;

    if (!ref || !inc) {
      throw new BadRequestException(
        `Se esperaban archivos en los campos:${
          !ref ? ' [referenceFiles]' : ''
        } ${!inc ? '[includesFiles]' : ''}, pero no se encontraron`,
      );
    }

    const allFiles = [...ref, ...inc];

    for (const file of allFiles) {
      if (typeof file.size === 'number' && file.size > MAX_FILE_SIZE) {
        throw new BadRequestException(
          `El archivo ${file.originalname} excede el tamaño máximo de ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)} MB`,
        );
      }
    }

    return this.filesService.createTaskFiles(files, id);
  }
}

// @Post('task/:id/includes-attachments')
// @UseInterceptors(
//   FilesInterceptor('files', 5, {
//     storage: memoryStorage(),
//   }),
// )
// createIncludesFiles(
//   @Param('id', ParseUUIDPipe) id: string,
//   @ValidateFiles() files: Express.Multer.File[],
// ) {
//   return this.filesService.createIncludesFiles(files, id);
// }

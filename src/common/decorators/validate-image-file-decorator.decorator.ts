import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

const DEFAULT_FILE_TYPE = /^image\/(png|jpg|jpeg|webp)$/;

export const ValidateImageFile = (maxFileSize?: number, fileType?: RegExp) => {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new FileTypeValidator({
          fileType: fileType || DEFAULT_FILE_TYPE,
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * (maxFileSize || 15),
        }), //? 15MB
      ],
      exceptionFactory: (error: any) => {
        if (error.includes('image') || error.includes('mimetype')) {
          throw new BadRequestException(
            'Tipo de archivo no permitido. Solo se permiten imágenes (PNG, JPG, JPEG, WEBP).',
          );
        } else if (error.includes('size') || error.includes('maxSize')) {
          throw new BadRequestException(
            `El tamaño máximo del archivo debe ser de ${maxFileSize || 15}MB`,
          );
        } else if (
          error.includes('required') ||
          error.includes('fileIsRequired')
        ) {
          throw new BadRequestException('El archivo es requerido');
        } else {
          throw new BadRequestException('Error de validación del archivo');
        }
      },
    }),
  );
};

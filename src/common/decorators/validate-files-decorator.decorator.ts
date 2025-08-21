import {
  ParseFilePipeBuilder,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';

const DEFAULT_FILE_TYPE = /^image\/(png|jpg|jpeg|webp)$/;

export const ValidateFiles = (maxFileSize?: number, fileType?: RegExp) => {
  const pipe = new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: fileType || DEFAULT_FILE_TYPE,
    })
    .addMaxSizeValidator({
      maxSize: 1024 * 1024 * (maxFileSize || 15),
    })
    .build({
      exceptionFactory: (error: any) => {
        console.error('Error de validación de archivos:', error);

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
          throw new BadRequestException('Los archivos son requeridos');
        } else {
          throw new BadRequestException('Error de validación de los archivos');
        }
      },
    });

  return UploadedFiles(pipe);
};

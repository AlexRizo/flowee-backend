import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const fileExceptionFilters = (error: string) => {
  if (error.includes('image')) {
    throw new BadRequestException(
      'Tipo de archivo no permitido. Solo se permiten imágenes.',
      'Error de validación',
    );
  } else if (error.includes('size')) {
    throw new BadRequestException(
      'El tamaño máximo del archivo debe de ser de 15MB',
      'Error de validación',
    );
  } else {
    console.error(error);
    throw new InternalServerErrorException(
      'Ha ocurrido un error al intentar subir el archivo',
    );
  }
};

import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { fileExceptionFilters } from 'src/common/helpers/exceptionFilters';

const DEFAULT_FILE_TYPE = /^image\/(png|jpg|jpeg|webp)$/;

export const ValidateImageFile = (maxFileSize?: number, fileType?: RegExp) => {
  return UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileType: fileType || DEFAULT_FILE_TYPE,
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * (maxFileSize || 15),
        }), //? 15MB
      ],
      exceptionFactory: fileExceptionFilters,
    }),
  );
};

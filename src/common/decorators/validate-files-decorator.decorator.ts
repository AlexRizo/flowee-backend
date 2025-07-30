import { ParseFilePipeBuilder, UploadedFile } from '@nestjs/common';
import { fileExceptionFilters } from 'src/common/helpers/exceptionFilters';

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
      exceptionFactory: fileExceptionFilters,
    });

  return UploadedFile(pipe);
};

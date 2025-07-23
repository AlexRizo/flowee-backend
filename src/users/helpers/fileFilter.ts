import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return cb(new BadRequestException('File is required'), false);

  if (!file.mimetype.match(/^image\/(png|jpg|jpeg|webp)$/)) {
    return cb(new BadRequestException('File is not an image'), false);
  }

  cb(null, true);
};

import {
  Controller,
  Delete,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ValidateImageFile } from 'src/common/decorators/validate-image-file-decorator.decorator';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  uploadAvatar(
    @ValidateImageFile()
    file: Express.Multer.File,
  ) {
    return this.s3Service.upload(file, 'avatars');
  }

  @Delete('delete')
  deleteFile(@Query('key') key: string) {
    return this.s3Service.deleteFile(key);
  }
}

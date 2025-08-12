import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
  UploadedFiles,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesPayloadPipe } from './pipes/files-payload.pipe';

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
      },
    ),
  )
  createReferenceFiles(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new FilesPayloadPipe({
        requireReference: true,
        requireIncludes: true,
        allowEmptyArrays: false,
        maxFileSize: 50, //?  50MB
      }),
    )
    files: {
      referenceFiles: Express.Multer.File[];
      includesFiles: Express.Multer.File[];
    },
  ) {
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

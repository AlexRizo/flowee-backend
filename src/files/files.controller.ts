import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ValidateFiles } from 'src/common/decorators/validate-files-decorator.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('task/:id/reference-attachments')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
    }),
  )
  createReferenceFiles(
    @Param('id', ParseUUIDPipe) id: string,
    @ValidateFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.createReferenceFiles(files, id);
  }

  @Post('task/:id/includes-attachments')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
    }),
  )
  createIncludesFiles(
    @Param('id', ParseUUIDPipe) id: string,
    @ValidateFiles() files: Express.Multer.File[],
  ) {
    return this.filesService.createIncludesFiles(files, id);
  }
}

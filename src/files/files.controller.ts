import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
  UploadedFiles,
  Get,
  Query,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesPayloadPipe } from './pipes/files-payload.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/interfaces/auth-decorator.interface';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Auth()
  @Get('task/:id')
  getTaskFiles(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.getTaskFiles(id);
  }

  @Auth()
  @Get('task/download/:id')
  downloadTaskFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('filename') filename?: string,
  ) {
    return this.filesService.downloadTaskFile(id, filename);
  }

  @Auth()
  @Get('task/versions/download/:id')
  downloadDeliveryFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('filename') filename?: string,
  ) {
    return this.filesService.downloadVersionFile(id, filename);
  }

  @Auth(
    Roles.ADMIN,
    Roles.DESIGN_MANAGER,
    Roles.PUBLISHER_MANAGER,
    Roles.PUBLISHER,
  )
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
      includeFiles: Express.Multer.File[];
    },
  ) {
    return this.filesService.createTaskFiles(files, id);
  }
}

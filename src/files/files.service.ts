import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileTask, FileTaskType } from './entities/task-file.entity';
import { Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { sanitizeFileName } from 'src/common/helpers/sanitizeFileName';

@Injectable()
export class FilesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly taskService: TasksService,
    @InjectRepository(FileTask)
    private readonly fileTaskRepository: Repository<FileTask>,
  ) {}

  async createTaskFiles(
    files: {
      referenceFiles: Express.Multer.File[];
      includesFiles: Express.Multer.File[];
    },
    id: string,
  ) {
    const task = await this.taskService.findOne(id);

    const referenceFiles = files.referenceFiles;
    const includesFiles = files.includesFiles;

    const refUploads = await Promise.allSettled(
      referenceFiles.map(file =>
        this.cloudinaryService.uploadBuffer(
          file.buffer,
          'reference-files',
          sanitizeFileName(file.originalname),
        ),
      ),
    );

    const incUploads = await Promise.allSettled(
      includesFiles.map(file =>
        this.cloudinaryService.uploadBuffer(
          file.buffer,
          'includes-files',
          sanitizeFileName(file.originalname),
        ),
      ),
    );

    let filesToInsert = [];

    filesToInsert = [
      ...refUploads.map((upload, index) =>
        upload.status === 'fulfilled'
          ? {
              public_id: upload.value.public_id,
              url: upload.value.secure_url,
              name: sanitizeFileName(referenceFiles[index].originalname),
              task,
              type: FileTaskType.REFERENCE,
            }
          : null,
      ),
    ];

    filesToInsert = [
      ...filesToInsert,
      ...incUploads.map((upload, index) =>
        upload.status === 'fulfilled'
          ? {
              public_id: upload.value.public_id,
              url: upload.value.secure_url,
              name: sanitizeFileName(includesFiles[index].originalname),
              task,
              type: FileTaskType.INCLUDE,
            }
          : null,
      ),
    ];

    const filesRejected = [
      ...refUploads
        .map((upload, index) =>
          upload.status === 'rejected' ? referenceFiles[index] : null,
        )
        .filter(Boolean),
      ...incUploads
        .map((upload, index) =>
          upload.status === 'rejected' ? includesFiles[index] : null,
        )
        .filter(Boolean),
    ];

    await this.fileTaskRepository.save(filesToInsert.filter(Boolean));

    if (filesRejected.length > 0) {
      return {
        message: 'Algunos archivos no se pudieron subir',
      };
    }

    return {
      message: 'Todos los archivos se han subido correctamente',
    };
  }

  createIncludesFiles(files: Express.Multer.File[], id: string) {
    console.log(files, id);
    return 'This action adds a new file';
  }
}

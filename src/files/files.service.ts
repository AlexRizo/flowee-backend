import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileTask, FileTaskType } from './entities/task-file.entity';
import { Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';

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
        this.cloudinaryService.uploadBuffer(file.buffer, 'reference-files'),
      ),
    );

    const incUploads = await Promise.allSettled(
      includesFiles.map(file =>
        this.cloudinaryService.uploadBuffer(file.buffer, 'includes-files'),
      ),
    );

    let filesToInsert = [];

    filesToInsert = [
      ...refUploads.map((upload, index) =>
        upload.status === 'fulfilled'
          ? {
              public_id: upload.value.public_id,
              url: upload.value.secure_url,
              name: referenceFiles[index].originalname,
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
              name: includesFiles[index].originalname,
              task,
              type: FileTaskType.INCLUDE,
            }
          : null,
      ),
    ];

    await this.fileTaskRepository.save(filesToInsert.filter(Boolean));

    return { refUploads, incUploads };
  }

  createIncludesFiles(files: Express.Multer.File[], id: string) {
    console.log(files, id);
    return 'This action adds a new file';
  }
}

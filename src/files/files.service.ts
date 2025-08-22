import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileTask, FileTaskType } from './entities/task-file.entity';
import { Repository } from 'typeorm';
import { TasksService } from 'src/tasks/tasks.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly s3Service: S3Service,
    private readonly taskService: TasksService,
    @InjectRepository(FileTask)
    private readonly fileTaskRepository: Repository<FileTask>,
  ) {}

  async getTaskFiles(id: string) {
    this.taskService.findOne(id);

    const taskFiles = await this.fileTaskRepository.findBy({
      task: { id },
    });

    if (!taskFiles.length) {
      throw new NotFoundException('No se encontraron archivos para la tarea');
    }

    const referenceFiles = taskFiles.filter(
      file => file.type === FileTaskType.REFERENCE,
    );

    const includeFiles = taskFiles.filter(
      file => file.type === FileTaskType.INCLUDE,
    );

    return {
      referenceFiles,
      includeFiles,
    };
  }

  async createTaskFiles(
    files: {
      referenceFiles: Express.Multer.File[];
      includeFiles: Express.Multer.File[];
    },
    id: string,
  ) {
    const task = await this.taskService.findOne(id);

    const referenceFiles = files.referenceFiles;
    const includeFiles = files.includeFiles;

    const refUploads = await this.s3Service.uploadMany(
      referenceFiles,
      'task-attachments/reference-files',
    );

    const incUploads = await this.s3Service.uploadMany(
      includeFiles,
      'task-attachments/include-files',
    );

    let filesToInsert = [];

    filesToInsert = [
      ...refUploads.uploaded.map(upload => ({
        key: upload.key,
        url: upload.url,
        name: upload.originalName,
        task,
        type: FileTaskType.REFERENCE,
      })),
    ];

    filesToInsert = [
      ...filesToInsert,
      ...incUploads.uploaded.map(upload => ({
        key: upload.key,
        url: upload.url,
        name: upload.originalName,
        task,
        type: FileTaskType.INCLUDE,
      })),
    ];

    await this.fileTaskRepository.save(filesToInsert.filter(Boolean));

    if (refUploads.rejected.length || incUploads.rejected.length) {
      return {
        message: 'Algunos archivos no se pudieron subir',
      };
    } else {
      return {
        message: 'Todos los archivos se han subido correctamente',
      };
    }
  }

  createIncludesFiles(files: Express.Multer.File[], id: string) {
    console.log(files, id);
    return 'This action adds a new file';
  }
}

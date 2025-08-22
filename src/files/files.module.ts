import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTask } from './entities/task-file.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  controllers: [FilesController],
  imports: [
    TypeOrmModule.forFeature([FileTask]),
    S3Module,
    forwardRef(() => TasksModule),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

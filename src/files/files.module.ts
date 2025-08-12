import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTask } from './entities/task-file.entity';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  controllers: [FilesController],
  imports: [
    TypeOrmModule.forFeature([FileTask]),
    CloudinaryModule,
    forwardRef(() => TasksModule),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

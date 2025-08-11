import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTask } from './entities/task-file.entity';

@Module({
  controllers: [FilesController],
  imports: [TypeOrmModule.forFeature([FileTask]), CloudinaryModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

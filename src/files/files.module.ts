import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileTask } from './entities/task-file.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { S3Module } from 'src/s3/s3.module';
import { DeliveriesModule } from 'src/deliveries/deliveries.module';

@Module({
  controllers: [FilesController],
  imports: [
    TypeOrmModule.forFeature([FileTask]),
    S3Module,
    forwardRef(() => TasksModule),
    forwardRef(() => DeliveriesModule),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

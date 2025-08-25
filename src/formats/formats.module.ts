import { forwardRef, Module } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { FormatsController } from './formats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Format } from './entities/format.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { AuthModule } from 'src/auth/auth.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Format]),
    forwardRef(() => TasksModule),
    AuthModule,
    S3Module,
  ],
  controllers: [FormatsController],
  providers: [FormatsService],
  exports: [FormatsService],
})
export class FormatsModule {}

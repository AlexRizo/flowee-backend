import { Module } from '@nestjs/common';
import { FormatsService } from './formats.service';
import { FormatsController } from './formats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Format } from './entities/format.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Format]), TasksModule, AuthModule],
  controllers: [FormatsController],
  providers: [FormatsService],
})
export class FormatsModule {}

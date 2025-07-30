import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import { SpecialTasksService } from './special-tasks.service';
import { SpecialTask } from './entities/special-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Board, SpecialTask]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, SpecialTasksService],
})
export class TasksModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Board } from 'src/boards/entities/board.entity';
import { SpecialTasksService } from './special-tasks.service';
import { SpecialTask } from './entities/special-task.entity';
import { UsersModule } from 'src/users/users.module';
import { BoardsModule } from 'src/boards/boards.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Board, SpecialTask]),
    AuthModule,
    BoardsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => FilesModule),
  ],
  controllers: [TasksController],
  providers: [TasksService, SpecialTasksService],
  exports: [TasksService, SpecialTasksService, TypeOrmModule],
})
export class TasksModule {}

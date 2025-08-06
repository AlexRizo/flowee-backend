import { Module } from '@nestjs/common';
import { TasksWsService } from './tasks-ws.service';
import { TasksWsGateway } from './tasks-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule],
  providers: [TasksWsGateway, TasksWsService],
})
export class TasksWsModule {}

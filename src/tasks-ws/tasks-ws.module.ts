import { Module } from '@nestjs/common';
import { TasksWsService } from './tasks-ws.service';
import { TasksWsGateway } from './tasks-ws.gateway';

@Module({
  providers: [TasksWsGateway, TasksWsService],
})
export class TasksWsModule {}

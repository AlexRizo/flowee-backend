import { Module } from '@nestjs/common';
import { TasksWsService } from './tasks-ws.service';
import { TasksWsGateway } from './tasks-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { ChatModule } from 'src/chat/chat.module';
import { ChatWsService } from './chat-ws.service';

@Module({
  imports: [AuthModule, TasksModule, ChatModule],
  providers: [TasksWsGateway, TasksWsService, ChatWsService],
})
export class TasksWsModule {}

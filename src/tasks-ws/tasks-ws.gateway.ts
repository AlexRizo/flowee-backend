import { WebSocketGateway } from '@nestjs/websockets';
import { TasksWsService } from './tasks-ws.service';

@WebSocketGateway()
export class TasksWsGateway {
  constructor(private readonly tasksWsService: TasksWsService) {}
}

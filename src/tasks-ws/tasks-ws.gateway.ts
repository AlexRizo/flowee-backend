import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { TasksWsService } from './tasks-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class TasksWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly tasksWsService: TasksWsService) {}

  handleConnection(client: Socket) {
    this.tasksWsService.registerClient(client);
  }

  handleDisconnect(client: Socket) {
    this.tasksWsService.removeClient(client.id);
  }
}

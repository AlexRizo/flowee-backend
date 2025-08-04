import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { TasksWsService } from './tasks-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class TasksWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly tasksWsService: TasksWsService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized', server.engine.opts.cors);
  }

  handleConnection(client: Socket) {
    console.log('Client connectedddd', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }
}

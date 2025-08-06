import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TasksWsService } from './tasks-ws.service';
import { Server, Socket } from 'socket.io';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class TasksWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly tasksWsService: TasksWsService) {}

  handleConnection(client: Socket) {
    console.log('client connected', client.id);
    this.tasksWsService.registerClient(client);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected', client.id);
    this.tasksWsService.removeClient(client.id);
  }

  @SubscribeMessage('join-board')
  onJoinBoard(client: Socket, payload: { boardId: string }) {
    client.join(payload.boardId);
    console.log('client joined board', payload.boardId);
  }

  @SubscribeMessage('leave-board')
  onLeaveBoard(client: Socket, payload: { boardId: string }) {
    client.leave(payload.boardId);
    console.log('client left board', payload.boardId);
  }

  @SubscribeMessage('task-status-update')
  onTaskStatusUpdate(client: Socket, payload: UpdateTaskStatusDto) {
    client.to(payload.boardId).emit('task-status-updated', {
      taskId: payload.taskId,
      status: payload.status,
    });
  }
}

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
import { getAcessToken } from 'src/auth/helpers/getAccessToken';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';

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

  constructor(
    private readonly tasksWsService: TasksWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    console.log('client connected', client.id);
    const token = getAcessToken(client.handshake.headers.cookie);
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch {
      client.disconnect();
      return;
    }

    this.tasksWsService.registerClient(client, payload.id);
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
    this.tasksWsService.updateTaskStatus(payload.taskId, payload.status);

    client.to(payload.boardId).emit('task-status-updated', {
      taskId: payload.taskId,
      status: payload.status,
    });
  }
}

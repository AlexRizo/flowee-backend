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
import { JoinBoardDto } from './dtos/join-board.dto';
import { CreateTaskDto } from './dtos/create-task.dto';

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

  async handleConnection(client: Socket) {
    console.log('client connected', client.id);
    const token = getAcessToken(client.handshake.headers.cookie);
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.tasksWsService.registerClient(client, payload.id);
    } catch {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected', client.id);
    this.tasksWsService.removeClient(client.id);
  }

  @SubscribeMessage('join-board')
  onJoinBoard(client: Socket, payload: JoinBoardDto) {
    client.join(payload.boardId);
    this.tasksWsService.joinUserToBoard(client, payload);

    console.log(client.rooms);
  }

  @SubscribeMessage('leave-board')
  onLeaveBoard(client: Socket, payload: { boardId: string }) {
    client.leave(`${payload.boardId}`);
    if (client.rooms.has(`${payload.boardId}-manager`)) {
      client.leave(`${payload.boardId}-manager`);
    }
  }

  @SubscribeMessage('task-status-update')
  onTaskStatusUpdate(client: Socket, payload: UpdateTaskStatusDto) {
    this.tasksWsService.updateTaskStatus(payload.taskId, payload.status);

    client.to(payload.boardId).emit('task-status-updated', {
      taskId: payload.taskId,
      status: payload.status,
    });
  }

  @SubscribeMessage('task-created')
  onTaskCreated(client: Socket, payload: CreateTaskDto) {
    client
      .to(`${payload.board.id}-manager`)
      .emit('unassigned-task-created', payload);
  }
}

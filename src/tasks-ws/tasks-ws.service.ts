import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { TasksService } from 'src/tasks/tasks.service';
import { Status } from 'src/tasks/utils/utils';

interface ConnectedClients {
  [id: string]: Socket;
}

@Injectable()
export class TasksWsService {
  private connectedClients: ConnectedClients = {};

  constructor(private readonly tasksService: TasksService) {}

  registerClient(client: Socket, userId: string) {
    this.connectedClients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

  async updateTaskStatus(taskId: string, status: Status) {
    return this.tasksService.updateStatus(taskId, status);
  }
}

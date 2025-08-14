import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { TasksService } from 'src/tasks/tasks.service';
import { Status } from 'src/tasks/utils/utils';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class TasksWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    private readonly tasksService: TasksService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user || !user.isActive) {
      throw new Error('Usuario no encontrado');
    }

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): ConnectedClients {
    return this.connectedClients;
  }

  async updateTaskStatus(taskId: string, status: Status) {
    return this.tasksService.updateStatus(taskId, status);
  }
}

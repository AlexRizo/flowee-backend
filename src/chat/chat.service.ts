import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessages } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessages)
    private readonly chatMessagesRepository: Repository<ChatMessages>,

    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  async getTaskMessages(taskId: string) {
    await this.tasksService.findOne(taskId);

    const messages = await this.chatMessagesRepository.findBy({
      task: { id: taskId },
    });

    if (!messages || !messages.length) {
      throw new NotFoundException('No se encontraron mensajes para esta tarea');
    }

    return messages;
  }

  async create({ content, taskId, userId }: CreateMessageDto) {
    await this.usersService.findOne(userId);
    await this.tasksService.findOne(taskId);

    try {
      const message = this.chatMessagesRepository.create({
        content,
        task: { id: taskId },
        user: { id: userId },
      });

      await this.chatMessagesRepository.save(message);

      return {
        message: 'Message created',
        chatMessage: message,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear el mensaje');
    }
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,

    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  async getTaskMessages(taskId: string) {
    await this.tasksService.findOne(taskId);

    const messages = await this.chatMessagesRepository.find({
      where: { task: { id: taskId } },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
      },
      take: 10,
    });

    if (!messages || !messages.length) {
      throw new NotFoundException('No se encontraron mensajes para esta tarea');
    }

    return { messages: messages.reverse() };
  }

  async create({ content, taskId, userId }: CreateMessageDto) {
    const user = await this.usersService.findOne(userId);
    await this.tasksService.findOne(taskId);

    try {
      const message = this.chatMessagesRepository.create({
        content,
        task: { id: taskId },
        user,
      });

      await this.chatMessagesRepository.save(message);

      return {
        message: 'Mensaje creado',
        chatMessage: {
          ...message,
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          },
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear el mensaje');
    }
  }
}

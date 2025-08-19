import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';

@Injectable()
export class ChatWsService {
  constructor(private readonly chatService: ChatService) {}

  async createMessage(client: Socket, payload: CreateMessageDto) {
    return await this.chatService.create(payload);
  }
}

import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth()
  @Get('messages/:taskId')
  getTaskMessages(@Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.chatService.getTaskMessages(taskId);
  }
}

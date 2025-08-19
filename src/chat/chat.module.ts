import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat.entity';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    TasksModule,
    UsersModule,
    AuthModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService, TypeOrmModule],
})
export class ChatModule {}

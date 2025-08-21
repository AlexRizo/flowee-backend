import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FilesModule } from './files/files.module';
import { TasksWsModule } from './tasks-ws/tasks-ws.module';
import { ChatModule } from './chat/chat.module';
import { FormatsModule } from './formats/formats.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    BoardsModule,
    TasksModule,
    CloudinaryModule,
    FilesModule,
    TasksWsModule,
    ChatModule,
    FormatsModule,
    DeliveriesModule,
    S3Module,
  ],
  controllers: [],
})
export class AppModule {}

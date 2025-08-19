import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, user => user.messages, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Task, task => task.messages, {
    eager: true,
    onDelete: 'CASCADE',
  })
  task: Task;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

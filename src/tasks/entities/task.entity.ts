import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpecialTask } from './special-task.entity';
import { FileTask } from 'src/files/entities/task-file.entity';
import { ChatMessage } from 'src/chat/entities/chat.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'text',
  })
  priority: string;

  @Column({
    type: 'text',
  })
  status: string;

  @Column({
    type: 'text',
  })
  type: string;

  @OneToMany(() => FileTask, file => file.task, { cascade: true })
  files: FileTask[];

  @OneToOne(() => SpecialTask, specialTask => specialTask.task, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  specialTask: SpecialTask;

  @ManyToOne(() => User, user => user.createdTasks, { cascade: true })
  author: User;

  @ManyToOne(() => User, user => user.assignedTasks, { cascade: true })
  assignedTo: User;

  @ManyToOne(() => Board, board => board.tasks, { cascade: true })
  board: Board;

  @OneToMany(() => ChatMessage, message => message.task)
  messages: ChatMessage[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  dueDate: Date;
}

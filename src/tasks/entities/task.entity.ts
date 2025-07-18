import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, user => user.createdTasks, { cascade: true })
  author: User;

  @ManyToOne(() => User, user => user.assignedTasks, { cascade: true })
  assignedTo: User;

  @ManyToOne(() => Board, board => board.tasks, { cascade: true })
  board: Board;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  dueDate: Date;
}

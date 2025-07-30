import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('tasks')
export class DigitalTask {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  task: Task;

  @Column({
    type: 'text',
    length: 1000,
  })
  idea: string;

  
}

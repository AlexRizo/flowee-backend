import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';

export enum FileTaskType {
  REFERENCE = 'reference',
  INCLUDE = 'include',
}

@Entity('task-files')
export class FileTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  public_id: string;

  @Column({ type: 'text' })
  url: string;

  @ManyToOne(() => Task, task => task.files, { onDelete: 'CASCADE' })
  task: Task;

  @Column({ type: 'text', enum: FileTaskType })
  type: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

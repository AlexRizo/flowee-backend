import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('special_tasks')
export class SpecialTask {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Task, task => task.specialTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  task: Task;

  @Column({
    type: 'text',
    length: 1000,
  })
  idea: string;

  @Column({
    type: 'text',
    length: 100,
  })
  sizes: string;

  @Column({
    type: 'text',
    length: 500,
  })
  legals: string;
}

import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.entity';
import { Exclude } from 'class-transformer';

@Entity('special_tasks')
export class SpecialTask {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => Task, task => task.specialTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  @Exclude()
  task: Task;

  // @Column({
  //   type: 'text',
  // })
  // idea: string;

  @Column({
    type: 'text',
  })
  sizes: string;

  @Column({
    type: 'text',
  })
  legals: string;
}

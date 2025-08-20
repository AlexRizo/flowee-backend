import { Delivery } from 'src/deliveries/entities/delivery.entity';
import { Task } from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('formats')
export class Format {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Task, task => task.formats, { onDelete: 'CASCADE' })
  task: Task;

  @OneToMany(() => Delivery, delivery => delivery.format, { cascade: false })
  deliveries: Delivery[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

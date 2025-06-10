import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { Board } from 'src/boards/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  nickname: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text', array: true, default: [Roles.READER] })
  roles: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Board, board => board.users)
  @JoinTable()
  boards: Board[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

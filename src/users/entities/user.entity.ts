import { Roles } from 'src/auth/interfaces/auth-decorator.interface';
import { Board } from 'src/boards/entities/board.entity';
import { Task } from 'src/tasks/entities/task.entity';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMessages } from 'src/chat/entities/chat.entity';

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

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'text', array: true, default: [Roles.READER] })
  roles: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Board, board => board.users)
  @JoinTable()
  boards: Board[];

  @OneToMany(() => Task, task => task.author)
  createdTasks: Task[];

  @OneToMany(() => Task, task => task.assignedTo)
  assignedTasks: Task[];

  @OneToMany(() => ChatMessages, message => message.user)
  messages: ChatMessages[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.nickname = this.nickname.toLowerCase().trim();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async checkPasswordBeforeUpdate() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}

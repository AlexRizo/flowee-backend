import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 2,
  })
  prefix: string;

  @Column({
    type: 'text',
  })
  color: string;

  @ManyToMany(() => User, user => user.boards)
  users: User[];

  @OneToMany(() => Task, task => task.board)
  tasks: Task[];

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

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.name
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // ? Elimina acentos
        .replace(/[^a-z0-9\s-]/g, '') // ? Solo permite letras, números, espacios y guiones
        .replace(/\s+/g, '-') // ? Reemplaza espacios por guiones
        .replace(/-+/g, '-'); // ? Evita guiones múltiples consecutivos
    }
  }

  @BeforeInsert()
  checkPrefixInsert() {
    if (!this.prefix) {
      this.prefix = this.prefix.toUpperCase();
    }
  }
}

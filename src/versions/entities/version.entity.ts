import { Delivery } from 'src/deliveries/entities/delivery.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  UpdateDateColumn,
} from 'typeorm';
import { VersionStatus } from '../interfaces/version.interface';

@Entity('versions')
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'delivery_id', type: 'uuid' })
  deliveryId: string;

  @ManyToOne(() => Delivery, delivery => delivery.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'delivery_id' })
  delivery: Delivery;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'text' })
  filename: string;

  @Column({ type: 'text' })
  url: string;

  @Column({
    type: 'enum',
    enum: VersionStatus,
    default: VersionStatus.PENDING,
  })
  status: VersionStatus;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  setDefaultStatus() {
    this.status = VersionStatus.PENDING;
  }
}

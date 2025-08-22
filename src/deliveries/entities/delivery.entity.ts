import { Format } from 'src/formats/entities/format.entity';
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

enum DeliveryStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'format_id', type: 'uuid' })
  formatId: string;

  @ManyToOne(() => Format, format => format.deliveries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'format_id' })
  format: Format;

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
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  setDefaultStatus() {
    this.status = DeliveryStatus.PENDING;
  }
}

import { Operator } from 'src/operators/entities/operator.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  chatId: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  additionalPhone: string;

  @Column()
  username: string;

  @ManyToOne(() => Operator, { nullable: true })
  referrerOperator: Operator;

  @Column({ nullable: true })
  utmTag: string;

  @CreateDateColumn()
  applicationDate: Date;

  @Column({ default: 'pending' })
  status: string;
}

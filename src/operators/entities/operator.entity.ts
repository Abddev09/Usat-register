// src/operators/entities/operator.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('operators')
export class Operator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
link: string;

  @Column({default:0})
  referalCount:number
}

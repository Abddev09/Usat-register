// src/operators/entities/operator.entity.ts
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
  @OneToMany(() => User, user => user.referrerOperator,{nullable:true})
users: User[];
}
